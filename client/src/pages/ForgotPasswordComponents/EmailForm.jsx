import React, { useState } from "react";
import { Mail, ChevronRight, AlertCircle, CheckCircle } from "lucide-react";

function EmailForm({
  email,
  setEmail,
  isLoading,
  errorMessage,
  successMessage,
  handleSubmit,
}) {
  const [localError, setLocalError] = useState("");

  function handleEmailChange(e) {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setLocalError("");
  }

  function handleFormSubmit(e) {
    e.preventDefault();

    if (!email || !email.trim()) {
      setLocalError("Please enter your email address");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setLocalError("Please enter a valid email address");
      return;
    }

    setLocalError("");
    handleSubmit(e);
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-blue-100 hover:shadow-xl transition-all duration-300">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">
        Reset Your Password
      </h2>
      <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">
        Enter your email address and we'll send you a one-time password (OTP) to
        verify your identity
      </p>

      {errorMessage && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 flex items-center text-sm">
          <AlertCircle size={16} className="mr-2 flex-shrink-0" />
          {errorMessage}
        </div>
      )}

      {localError && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 flex items-center text-sm">
          <AlertCircle size={16} className="mr-2 flex-shrink-0" />
          {localError}
        </div>
      )}

      {successMessage && (
        <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 flex items-center text-sm">
          <CheckCircle size={16} className="mr-2 flex-shrink-0" />
          {successMessage}
        </div>
      )}

      <form onSubmit={handleFormSubmit}>
        <div className="space-y-5 sm:space-y-6">
          <div>
            <label className="block text-gray-700 text-xs sm:text-sm font-medium mb-1 sm:mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail
                size={16}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="email@example.com"
                required
                className="pl-10 w-full bg-white border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-md py-2 sm:py-3 text-sm sm:text-base text-gray-700 transition-all duration-200"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`cursor-pointer w-full flex items-center justify-center rounded-md py-2 sm:py-3 px-4 text-white text-sm font-medium transition-all duration-300 ${
              isLoading
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
                <span>Send OTP</span>
                <ChevronRight size={16} className="ml-2" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EmailForm;
