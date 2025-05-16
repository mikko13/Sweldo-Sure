import React, { useState, useEffect } from "react";
import {
  Lock,
  Eye,
  EyeOff,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Check,
} from "lucide-react";

function ResetPasswordForm({
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  showNewPassword,
  setShowNewPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  isLoading,
  errorMessage,
  successMessage,
  handleSubmit,
}) {
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
    const password = newPassword;
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
  }, [newPassword]);

  const PasswordCriteriaItem = ({ met, text }) => (
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

  const allRequirementsMet = [
    passwordCriteria.length,
    passwordCriteria.hasUppercase,
    passwordCriteria.hasLowercase,
    passwordCriteria.hasNumber,
    passwordCriteria.hasSpecial,
  ].every(Boolean);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-blue-100 hover:shadow-xl transition-all duration-300">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">
        Create New Password
      </h2>
      <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">
        Your identity has been verified. Please create a new password for your
        account.
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
            <label className="block text-gray-700 text-xs sm:text-sm font-medium mb-1 sm:mb-2">
              New Password
            </label>
            <div className="relative">
              <Lock
                size={16}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                placeholder="••••••••"
                required
                className={`pl-10 w-full bg-white border ${
                  newPassword && passwordStrength.score >= 3
                    ? "border-green-500"
                    : "border-blue-200"
                } focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-md py-2 sm:py-3 text-sm sm:text-base text-gray-700 transition-all duration-200`}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="cursor-pointer absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
              {newPassword && (
                <span className="absolute inset-y-0 right-10 flex items-center">
                  {passwordStrength.score >= 3 ? (
                    <Check size={18} className="text-green-500" />
                  ) : (
                    newPassword && (
                      <AlertCircle size={18} className="text-yellow-500" />
                    )
                  )}
                </span>
              )}
            </div>

            {(newPassword || passwordFocused) && (
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
          </div>

          <div>
            <label className="block text-gray-700 text-xs sm:text-sm font-medium mb-1 sm:mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <Lock
                size={16}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                className={`pl-10 w-full bg-white border ${
                  newPassword &&
                  confirmPassword &&
                  newPassword === confirmPassword
                    ? "border-green-500"
                    : "border-blue-200"
                } focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-md py-2 sm:py-3 text-sm sm:text-base text-gray-700 transition-all duration-200`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="cursor-pointer absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
              {newPassword && confirmPassword && (
                <span className="absolute inset-y-0 right-10 flex items-center">
                  {newPassword === confirmPassword ? (
                    <Check size={18} className="text-green-500" />
                  ) : (
                    <AlertCircle size={18} className="text-red-500" />
                  )}
                </span>
              )}
            </div>
            {newPassword &&
              confirmPassword &&
              newPassword !== confirmPassword && (
                <p className="text-xs text-red-500 mt-1 flex items-center">
                  <AlertCircle size={12} className="mr-1" /> Passwords do not
                  match
                </p>
              )}
            {newPassword &&
              confirmPassword &&
              newPassword === confirmPassword && (
                <p className="text-xs text-green-500 mt-1 flex items-center">
                  <CheckCircle size={12} className="mr-1" /> Passwords match
                </p>
              )}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={
                isLoading ||
                !newPassword ||
                !confirmPassword ||
                newPassword !== confirmPassword ||
                !allRequirementsMet
              }
              className={`cursor-pointer w-full flex items-center justify-center rounded-md py-2 sm:py-3 px-4 text-white text-sm font-medium transition-all duration-300 ${
                isLoading ||
                !newPassword ||
                !confirmPassword ||
                newPassword !== confirmPassword ||
                !allRequirementsMet
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
                  <span>Reset Password</span>
                  <ChevronRight size={16} className="ml-2" />
                </>
              )}
            </button>
          </div>

          <div className="text-center text-xs text-gray-500 pt-4">
            <p>
              By resetting your password, you agree to our{" "}
              <a href="#" className="text-blue-600 hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-blue-600 hover:underline">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}

export default ResetPasswordForm;
