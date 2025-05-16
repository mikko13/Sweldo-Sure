import React, { useRef, useEffect } from "react";
import {
  ChevronRight,
  AlertCircle,
  CheckCircle,
  RefreshCw,
} from "lucide-react";

function OtpForm({
  email,
  otp,
  setOtp,
  isLoading,
  isResending = false,
  errorMessage,
  successMessage,
  handleSubmit,
  handleResendOtp,
}) {
  const otpDigits = 6;
  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current = Array(otpDigits)
      .fill(null)
      .map((_, i) => inputRefs.current[i] || null);
  }, [otpDigits]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  useEffect(() => {
    if (!otp) {
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
    }
  }, [otp]);

  function handleKeyDown(e, index) {
    if (e.key === "Backspace") {
      if (index > 0 && !e.currentTarget.value) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  }

  function handleChange(e, index) {
    const value = e.target.value;

    if (value && !/^\d+$/.test(value)) {
      return;
    }

    const newOtp = otp.split("");
    newOtp[index] = value.slice(-1);
    setOtp(newOtp.join(""));

    if (value && index < otpDigits - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handlePaste(e) {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").trim();

    if (/^\d+$/.test(pastedData) && pastedData.length <= otpDigits) {
      setOtp(pastedData.slice(0, otpDigits).padEnd(otpDigits, ""));

      if (pastedData.length < otpDigits) {
        inputRefs.current[pastedData.length]?.focus();
      } else {
        inputRefs.current[otpDigits - 1]?.focus();
      }
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-blue-100 hover:shadow-xl transition-all duration-300">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">
        Verify Your Identity
      </h2>
      <p className="text-gray-600 text-sm sm:text-base">
        We've sent a 6-digit verification code to{" "}
        <span className="font-medium">{email}</span>
      </p>
      <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">
        Enter the code below to verify your identity
      </p>

      {errorMessage && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 flex items-center text-sm">
          <AlertCircle size={16} className="mr-2 flex-shrink-0" />
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 flex items-center text-sm">
          <CheckCircle size={16} className="mr-2 flex-shrink-0" />
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="space-y-5 sm:space-y-6">
          <div>
            <label className="block text-gray-700 text-xs sm:text-sm font-medium mb-4">
              Enter Verification Code
            </label>
            <div className="flex justify-between space-x-2">
              {Array.from({ length: otpDigits }).map((_, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={otp[index] || ""}
                  onChange={(e) => handleChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  disabled={isLoading || isResending}
                  className={`w-10 h-12 sm:w-12 sm:h-14 text-center border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-md text-lg font-medium text-gray-700 transition-all duration-200 ${
                    isLoading || isResending
                      ? "bg-gray-100 cursor-not-allowed"
                      : ""
                  }`}
                />
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={handleResendOtp}
            disabled={isLoading || isResending}
            className={`cursor-pointer w-full flex items-center justify-center rounded-md py-2 sm:py-3 px-4 text-blue-600 text-sm font-medium border border-blue-200 transition-all duration-300 ${
              isLoading || isResending
                ? "bg-gray-100 text-blue-400 cursor-not-allowed"
                : "hover:bg-blue-50"
            }`}
          >
            {isResending ? (
              <svg
                className="animate-spin h-5 w-5 text-blue-600 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              <RefreshCw size={16} className="mr-2" />
            )}
            <span>{isResending ? "Sending Code..." : "Resend Code"}</span>
          </button>

          <button
            type="submit"
            disabled={isLoading || isResending || otp.length !== otpDigits}
            className={`cursor-pointer w-full flex items-center justify-center rounded-md py-2 sm:py-3 px-4 text-white text-sm font-medium transition-all duration-300 ${
              isLoading || isResending || otp.length !== otpDigits
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 shadow-md hover:shadow-lg"
            }`}
          >
            {isLoading ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              <>
                <span>Verify</span>
                <ChevronRight size={16} className="ml-2" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default OtpForm;
