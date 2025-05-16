import React, { useState, useEffect } from "react";
import BrandSection from "./BrandSection";
import FeatureCard from "./FeatureCard";
import EmailForm from "./EmailForm";
import OtpForm from "./OtpForm";
import ResetPasswordForm from "./ResetPasswordForm";
import { PhilippinePeso, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";

function ForgotPasswordComponent() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [animationComplete, setAnimationComplete] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const navigate = useNavigate();

  const EMAILJS_SERVICE_ID = "service_9jb3hqb";
  const EMAILJS_TEMPLATE_ID = "template_smhn6eq";
  const EMAILJS_PUBLIC_KEY = "Ex_ZCsXg8MXzDBRlS";

  useEffect(() => {
    setTimeout(() => {
      setAnimationComplete(true);
    }, 1000);
  }, []);

  function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async function checkEmailExists(email) {
    try {
      const response = await fetch(
        "http://localhost:5000/api/users/check-email?email=" +
          encodeURIComponent(email)
      );
      const data = await response.json();
      return data.exists;
    } catch (error) {
      console.error("Error checking email:", error);
      return false;
    }
  }

  async function handleEmailSubmit(e) {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsLoading(true);

    try {
      if (!email || !email.includes("@")) {
        setErrorMessage("Please enter a valid email address");
        setIsLoading(false);
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/users/check-email?email=" +
          encodeURIComponent(email)
      );
      const data = await response.json();

      if (!data.exists) {
        setErrorMessage("Email not found. Please enter a registered email.");
        setIsLoading(false);
        return;
      }

      const newOtp = generateOTP();
      setGeneratedOtp(newOtp);

      const trimmedEmail = email.trim();

      const userData = data.user;

      const templateParams = {
        to_email: trimmedEmail,
        email: trimmedEmail,
        firstName: userData?.firstName || trimmedEmail.split("@")[0],
        lastName: userData?.lastName || "",
        otp: newOtp,
        message:
          "Use this OTP to reset your password. It will expire in 15 minutes.",
      };

      const emailResponse = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
      );

      if (emailResponse.status === 200) {
        setSuccessMessage(`OTP has been sent to ${email}`);
        setCurrentStep(2);
      } else {
        setErrorMessage("Failed to send OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage(
        `An error occurred: ${error.message || "Please try again later."}`
      );
    } finally {
      setIsLoading(false);
    }
  }

  function handleOtpSubmit(e) {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (otp === generatedOtp) {
      setSuccessMessage("OTP verified successfully");
      setCurrentStep(3);
    } else {
      setErrorMessage("Invalid OTP. Please check and try again.");
    }
  }

  async function handlePasswordSubmit(e) {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsLoading(true);

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/users/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            newPassword,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      const data = await response.json();

      setSuccessMessage("Password reset successful!");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Error resetting password:", error);
      setErrorMessage(
        error.message || "An error occurred. Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleResendOtp() {
    setErrorMessage("");
    setSuccessMessage("");
    setIsResending(true);
    setOtp("");

    try {
      const checkResponse = await fetch(
        "http://localhost:5000/api/users/check-email?email=" +
          encodeURIComponent(email)
      );
      const checkData = await checkResponse.json();

      if (!checkData.exists) {
        setErrorMessage("Email not found. Please start over.");
        setIsResending(false);
        return;
      }

      const newOtp = generateOTP();
      setGeneratedOtp(newOtp);

      const userData = checkData.user;

      const templateParams = {
        to_email: email.trim(),
        email: email.trim(),
        firstName: userData?.firstName || email.split("@")[0],
        lastName: userData?.lastName || "",
        otp: newOtp,
        message:
          "Here is your new OTP to reset your password. It will expire in 15 minutes.",
      };

      const response = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
      );

      if (response.status === 200) {
        setSuccessMessage(`New OTP has been sent to ${email}`);
      } else {
        setErrorMessage("Failed to send OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage(
        `An error occurred: ${error.message || "Please try again later."}`
      );
    } finally {
      setIsResending(false);
    }
  }

  function renderCurrentForm() {
    switch (currentStep) {
      case 1:
        return (
          <EmailForm
            email={email}
            setEmail={setEmail}
            isLoading={isLoading}
            errorMessage={errorMessage}
            successMessage={successMessage}
            handleSubmit={handleEmailSubmit}
          />
        );
      case 2:
        return (
          <OtpForm
            email={email}
            otp={otp}
            setOtp={setOtp}
            isLoading={isLoading}
            isResending={isResending}
            errorMessage={errorMessage}
            successMessage={successMessage}
            handleSubmit={handleOtpSubmit}
            handleResendOtp={handleResendOtp}
          />
        );
      case 3:
        return (
          <ResetPasswordForm
            newPassword={newPassword}
            setNewPassword={setNewPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            showNewPassword={showNewPassword}
            setShowNewPassword={setShowNewPassword}
            showConfirmPassword={showConfirmPassword}
            setShowConfirmPassword={setShowConfirmPassword}
            isLoading={isLoading}
            errorMessage={errorMessage}
            successMessage={successMessage}
            handleSubmit={handlePasswordSubmit}
          />
        );
      default:
        return null;
    }
  }

  return (
    <div className="flex min-h-screen w-full overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="hidden md:flex md:w-1/2 lg:w-3/5 bg-gradient-to-br from-blue-700 to-blue-900 text-white relative overflow-hidden">
        <div
          className={`absolute inset-0 transition-opacity duration-1000 ${
            animationComplete ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-1/10 left-1/10 w-20 h-20 rounded-full bg-blue-500 opacity-10"></div>
            <div className="absolute top-1/4 right-1/10 w-32 h-32 rounded-full bg-blue-400 opacity-10"></div>
            <div className="absolute bottom-1/4 left-1/5 w-48 h-48 rounded-full bg-blue-300 opacity-10"></div>
            <div className="absolute bottom-1/10 right-1/10 w-24 h-24 rounded-full bg-blue-600 opacity-10"></div>
          </div>
        </div>

        <div className="relative z-10 flex flex-col justify-center items-center w-full p-6 md:p-8 lg:p-12">
          <div
            className={`transform transition-all duration-1000 ${
              animationComplete
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <BrandSection />
            <div
              className={`space-y-6 md:space-y-8 transform transition-all duration-1000 delay-300 ${
                animationComplete
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
            >
              <FeatureCard
                icon={
                  <PhilippinePeso size={22} className="mr-3 flex-shrink-0" />
                }
                title="Effortless Payroll Management"
                description="Streamline your payroll operations with our comprehensive solution designed for modern businesses."
              />
              <FeatureCard
                icon={<Lock size={22} className="mr-3 flex-shrink-0" />}
                title="Secure & Compliant"
                description="Enterprise-grade security with full compliance to Philippines payroll regulations and standards."
              />
            </div>
          </div>
        </div>
      </div>

      <div className="w-full md:w-1/2 lg:w-2/5 flex flex-col justify-center items-center p-4 sm:p-6 md:p-8 lg:p-12">
        <div
          className={`w-full max-w-md transform transition-all duration-1000 delay-300 ${
            animationComplete
              ? "translate-y-0 opacity-100"
              : "translate-y-10 opacity-0"
          }`}
        >
          <div className="flex flex-col items-center mb-6 md:hidden">
            <BrandSection />
          </div>

          {renderCurrentForm()}

          <div className="mt-4 sm:mt-6 text-center">
            <p className="text-xs sm:text-sm text-gray-600">
              Remember your password?{" "}
              <a
                href="/"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Back to Login
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordComponent;
