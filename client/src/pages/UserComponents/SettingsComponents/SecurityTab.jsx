import {
  Lock,
  Shield,
  RefreshCw,
  EyeOff,
  Save,
  Loader,
  Check,
  AlertCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast, Toaster } from "sonner";
import axios from "axios";

function SecurityTab({ userId }) {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    label: "Empty",
    color: "gray-300",
  });
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecial: false,
  });

  useEffect(() => {
    const password = formData.newPassword;
    const criteria = {
      length: password.length >= 6,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    };

    setPasswordCriteria(criteria);

    const criteriaCount = Object.values(criteria).filter(Boolean).length;

    let strength;
    if (password === "") {
      strength = { score: 0, label: "Empty", color: "gray-300" };
    } else if (criteriaCount <= 1) {
      strength = { score: 1, label: "Very Weak", color: "red-500" };
    } else if (criteriaCount === 2) {
      strength = { score: 2, label: "Weak", color: "orange-500" };
    } else if (criteriaCount === 3) {
      strength = { score: 3, label: "Medium", color: "yellow-500" };
    } else if (criteriaCount === 4) {
      strength = { score: 4, label: "Strong", color: "green-500" };
    } else {
      strength = { score: 5, label: "Very Strong", color: "green-700" };
    }

    setPasswordStrength(strength);
  }, [formData.newPassword]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  }

  function validateForm() {
    const newErrors = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    } else if (passwordStrength.score < 3) {
      newErrors.newPassword = "Please create a stronger password";
    }

    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await axios.put(
        "http://localhost:5000/api/users/" + userId + "/password",
        {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      toast.success("Password updated successfully!", {
        description: "Your password has been changed.",
        duration: 3000,
      });

      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Error updating password:", error);

      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 401) {
          setErrors((prev) => ({
            ...prev,
            currentPassword: "Current password is incorrect",
          }));
          toast.error("Authentication Error", {
            description: "Current password is incorrect",
            duration: 4000,
          });
        } else {
          toast.error("Failed to update password", {
            description: error.response.data.message || "An error occurred",
            duration: 4000,
          });
        }
      } else {
        toast.error("Update Failed", {
          description: "An unexpected error occurred",
          duration: 4000,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  function PasswordCriteriaItem({ met, text }) {
    return (
      <div
        className={`flex items-center transition-all duration-300 ${
          met ? "text-green-600" : "text-gray-400"
        }`}
      >
        {met ? (
          <Check size={16} className="mr-2 text-green-500" />
        ) : (
          <div className="w-4 h-4 mr-2 border border-gray-300 rounded-full" />
        )}
        <span
          className={`text-xs transition-all duration-300 ${
            met ? "font-medium" : "font-normal"
          }`}
        >
          {text}
        </span>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-blue-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-medium text-gray-800 flex items-center">
          <Lock size={18} className="mr-2 text-blue-800" />
          Change Password
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Current Password
          </label>
          <input
            type="password"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${
              errors.currentPassword ? "border-red-500" : "border-blue-200"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800`}
          />
          {errors.currentPassword && (
            <p className="text-sm text-red-600 mt-1">
              {errors.currentPassword}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            New Password
          </label>
          <div className="relative">
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              className={`w-full px-3 py-2 border ${
                errors.newPassword
                  ? "border-red-500"
                  : formData.newPassword && passwordStrength.score >= 3
                  ? "border-green-500"
                  : "border-blue-200"
              } rounded-md focus:outline-none focus:ring-2 ${
                passwordStrength.score >= 3
                  ? "focus:ring-green-500"
                  : "focus:ring-blue-500"
              } text-gray-800`}
            />
            {formData.newPassword && (
              <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                {passwordStrength.score >= 3 ? (
                  <Check size={18} className="text-green-500" />
                ) : (
                  <AlertCircle size={18} className="text-yellow-500" />
                )}
              </span>
            )}
          </div>

          {(formData.newPassword || passwordFocused) && (
            <div
              className={`mt-2 transition-all duration-300 ${
                passwordFocused ? "opacity-100" : "opacity-90"
              }`}
            >
              <div className="flex mb-1">
                <div className="flex-1 h-1 rounded-full bg-gray-200 overflow-hidden flex">
                  {[1, 2, 3, 4, 5].map((segment) => (
                    <div
                      key={segment}
                      className={`h-full w-1/5 transition-all duration-300 ${
                        passwordStrength.score >= segment
                          ? `bg-${passwordStrength.color}`
                          : "bg-gray-200"
                      }`}
                      style={{
                        transform:
                          passwordStrength.score >= segment
                            ? "scaleX(1)"
                            : "scaleX(0.5)",
                        opacity: passwordStrength.score >= segment ? 1 : 0.3,
                        transformOrigin: "left",
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center mb-2">
                <span
                  className={`text-xs font-medium text-${passwordStrength.color}`}
                >
                  {passwordStrength.label}
                </span>
              </div>

              <div className="bg-blue-50 rounded-md p-3 border border-blue-100 space-y-2">
                <PasswordCriteriaItem
                  met={passwordCriteria.length}
                  text="At least 6 characters"
                />
                <PasswordCriteriaItem
                  met={passwordCriteria.hasUppercase}
                  text="At least one uppercase letter (A-Z)"
                />
                <PasswordCriteriaItem
                  met={passwordCriteria.hasLowercase}
                  text="At least one lowercase letter (a-z)"
                />
                <PasswordCriteriaItem
                  met={passwordCriteria.hasNumber}
                  text="At least one number (0-9)"
                />
                <PasswordCriteriaItem
                  met={passwordCriteria.hasSpecial}
                  text="At least one special character (!@#$%^&*)"
                />
              </div>
            </div>
          )}

          {errors.newPassword && (
            <p className="text-sm text-red-600 mt-1">{errors.newPassword}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirm New Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${
              errors.confirmPassword ? "border-red-500" : "border-blue-200"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800`}
          />
          {errors.confirmPassword && (
            <p className="text-sm text-red-600 mt-1">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 rounded-md text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 shadow-sm flex items-center cursor-pointer"
          >
            {isSubmitting ? (
              <Loader size={16} className="mr-2 animate-spin" />
            ) : (
              <Save size={16} className="mr-2" />
            )}
            {isSubmitting ? "Updating..." : "Update Password"}
          </button>
        </div>
      </form>

      <Toaster position="bottom-left" richColors />
    </div>
  );
}

export default SecurityTab;
