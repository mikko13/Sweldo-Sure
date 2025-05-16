import React, { useState, useRef, useEffect } from "react";
import {
  Save,
  ArrowLeft,
  User,
  Loader,
  Upload,
  X,
  Check,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, Toaster } from "sonner";

function CreateUserForm({ onSubmit, onCancel }) {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    profilePicture: null,
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const [passwordFocused, setPasswordFocused] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    label: "Too Weak",
    color: "red-500",
  });
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecial: false,
  });

  useEffect(() => {
    const password = formData.password;
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
  }, [formData.password]);

  function validateForm() {
    const newErrors = {};

    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = "Please enter a valid email address";
      }
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    } else if (passwordStrength.score < 3) {
      newErrors.password = "Please create a stronger password";
    }

    return newErrors;
  }

  function handleChange(e) {
    const { name, value } = e.target;

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }

    setFormData({ ...formData, [name]: value });
  }

  function handleFileChange(e) {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (file.size > 2 * 1024 * 1024) {
        setErrors({
          ...errors,
          profilePicture: "File size should not exceed 2MB",
        });
        return;
      }

      if (!file.type.match("image.*")) {
        setErrors({
          ...errors,
          profilePicture: "Please select an image file",
        });
        return;
      }

      setFormData({ ...formData, profilePicture: file });

      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);

      if (errors.profilePicture) {
        setErrors({ ...errors, profilePicture: "" });
      }
    }
  }

  function removeProfilePicture() {
    setFormData({ ...formData, profilePicture: null });
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function triggerFileInput() {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      const firstErrorField = Object.keys(validationErrors)[0];
      const element = document.getElementById(firstErrorField);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        element.focus();
      }
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const submitData = new FormData();
      submitData.append("firstName", formData.firstName);
      submitData.append("lastName", formData.lastName);
      submitData.append("email", formData.email);
      submitData.append("password", formData.password);

      if (formData.profilePicture) {
        submitData.append("profilePicture", formData.profilePicture);
      }

      const response = await axios.post(
        "http://localhost:5000/api/users",
        submitData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("User created successfully!", {
        description:
          formData.firstName +
          " " +
          formData.lastName +
          " has been added to the system.",
        duration: 3000,
      });

      if (onSubmit) {
        onSubmit(formData);
      }

      setTimeout(() => {
        navigate("/admin-user-accounts", {
          state: { message: "User created successfully!", type: "success" },
        });
      }, 3000);
    } catch (err) {
      console.error("Error creating user:", err);

      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || "Failed to create user");
        toast.error("Failed to create user", {
          description:
            err.response.data.message || "An unexpected error occurred.",
        });
      } else {
        setError("An unexpected error occurred. Please try again.");
        toast.error("Error", {
          description: "An unexpected error occurred. Please try again.",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  }

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

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="h-full w-full p-4 md:p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <button
              onClick={() => navigate("/admin-user-accounts")}
              className="mr-3 p-2 rounded-full hover:bg-blue-100 transition-colors text-blue-600 cursor-pointer"
              aria-label="Go back"
            >
              <ArrowLeft size={20} />
            </button>
            <h2 className="text-xl md:text-2xl font-bold text-blue-800">
              Create New User
            </h2>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          <div className="bg-white p-4 md:p-5 rounded-lg shadow-sm border border-blue-100">
            <div className="flex items-center mb-4">
              <User className="text-blue-600 mr-2" size={18} />
              <h3 className="text-md font-semibold text-blue-800">
                User Information
              </h3>
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-center mb-4">
                <div className="w-full max-w-md">
                  <div className="flex flex-col items-center">
                    {previewUrl ? (
                      <div className="relative mb-4">
                        <img
                          src={previewUrl}
                          alt="Profile preview"
                          className="w-32 h-32 rounded-full object-cover border-2 border-blue-500"
                        />
                        <button
                          type="button"
                          onClick={removeProfilePicture}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                          aria-label="Remove image"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center mb-4 border-2 border-dashed border-blue-300">
                        <User size={40} className="text-gray-400" />
                      </div>
                    )}
                    <input
                      type="file"
                      ref={fileInputRef}
                      id="profilePicture"
                      name="profilePicture"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={triggerFileInput}
                      className="cursor-pointer px-4 py-2 bg-blue-50 border border-blue-300 rounded-md text-sm font-medium text-blue-700 hover:bg-blue-100 transition-all duration-200 flex items-center"
                    >
                      <Upload size={16} className="mr-2" />
                      {previewUrl ? "Change Photo" : "Upload Photo"}
                    </button>
                    {errors.profilePicture && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.profilePicture}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                      Recommended: Square JPG or PNG, max 5MB
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700"
                >
                  First Name*
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`w-full rounded-md border ${
                    errors.firstName ? "border-red-500" : "border-blue-200"
                  } px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                  placeholder="Enter first name"
                />
                {errors.firstName && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.firstName}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Last Name*
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`w-full rounded-md border ${
                    errors.lastName ? "border-red-500" : "border-blue-200"
                  } px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                  placeholder="Enter last name"
                />
                {errors.lastName && (
                  <p className="text-sm text-red-600 mt-1">{errors.lastName}</p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email*
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full rounded-md border ${
                    errors.email ? "border-red-500" : "border-blue-200"
                  } px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                  placeholder="Enter email address"
                />
                {errors.email && (
                  <p className="text-sm text-red-600 mt-1">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password*
                </label>
                <div className="relative">
                  <input
                    type="password"
                    id="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                    className={`w-full rounded-md border ${
                      errors.password
                        ? "border-red-500"
                        : formData.password && passwordStrength.score >= 3
                        ? "border-green-500"
                        : "border-blue-200"
                    } px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 ${
                      passwordStrength.score >= 3
                        ? "focus:ring-green-500"
                        : "focus:ring-blue-500"
                    } transition-all duration-200`}
                    placeholder="Enter password"
                  />
                  {formData.password && (
                    <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                      {passwordStrength.score >= 3 ? (
                        <Check size={18} className="text-green-500" />
                      ) : (
                        formData.password && (
                          <AlertCircle size={18} className="text-yellow-500" />
                        )
                      )}
                    </span>
                  )}
                </div>

                {/* Password strength indicator */}
                {(formData.password || passwordFocused) && (
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
                              opacity:
                                passwordStrength.score >= segment ? 1 : 0.3,
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

                {errors.password && (
                  <p className="text-sm text-red-600 mt-1">{errors.password}</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-4 md:mt-6">
            <button
              type="button"
              onClick={() => navigate("/admin-user-accounts")}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 shadow-sm cursor-pointer"
            >
              Cancel
            </button>
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
              {isSubmitting ? "Saving..." : "Save User"}
            </button>
          </div>
        </form>
      </div>
      <Toaster position="bottom-left" richColors />
    </div>
  );
}

export default CreateUserForm;
