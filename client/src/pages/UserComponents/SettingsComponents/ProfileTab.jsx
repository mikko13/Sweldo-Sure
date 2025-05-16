import { Save, Upload, X, Check, AlertCircle, User } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { toast, Toaster } from "sonner";

function ProfileTab({ formData, handleChange, handleSubmit }) {
  const [userData, setUserData] = useState(formData);
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasExistingImage, setHasExistingImage] = useState(false);
  const [removeCurrentImage, setRemoveCurrentImage] = useState(false);
  const [errors, setErrors] = useState({});
  const [imageVersion, setImageVersion] = useState(Date.now());
  const [enlargedImageUrl, setEnlargedImageUrl] = useState(null);

  useEffect(() => {
    async function fetchCurrentUser() {
      try {
        setIsLoading(true);
        const response = await axios.get(
          "http://localhost:5000/api/users/current",
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );
        setUserData({
          ...userData,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          email: response.data.email,
        });

        if (response.data.profilePicture?.hasImage) {
          setHasExistingImage(true);
          setPreviewUrl(
            "http://localhost:5000/api/users/" +
              response.data._id +
              "/profile-picture?" +
              Date.now()
          );
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to load user data", {
          description: "Could not retrieve your profile information.",
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchCurrentUser();
  }, []);

  function handleViewProfilePicture() {
    if (previewUrl) {
      setEnlargedImageUrl(previewUrl);
    }
  }

  function validateForm() {
    const newErrors = {};

    if (!userData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    if (!userData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    return newErrors;
  }

  function handleInputChange(e) {
    const { name, value } = e.target;

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }

    setUserData({ ...userData, [name]: value });
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

      setProfilePicture(file);
      setRemoveCurrentImage(false);

      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);

      if (errors.profilePicture) {
        setErrors({ ...errors, profilePicture: "" });
      }
    }
  }

  function removeProfilePicture() {
    setProfilePicture(null);
    setPreviewUrl(null);
    setRemoveCurrentImage(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function triggerFileInput() {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }

  async function handleProfileSubmit(e) {
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

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("firstName", userData.firstName);
      formData.append("lastName", userData.lastName);
      formData.append("email", userData.email);

      if (profilePicture) {
        formData.append("profilePicture", profilePicture);
      } else if (removeCurrentImage) {
        formData.append("removeProfilePicture", "true");
      }

      const response = await axios.put(
        "http://localhost:5000/api/users/current",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      toast.success("Profile updated successfully!", {
        description: "Your profile information has been saved.",
        duration: 3000,
      });

      setImageVersion(Date.now());

      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile", {
        description: "An error occurred while saving your changes.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading && !userData.firstName) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin mx-auto mb-4 h-8 w-8 text-blue-600">
            ↻
          </div>
          <p className="text-gray-600">Loading user data...</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleProfileSubmit} className="w-full px-2 sm:px-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h2 className="text-lg font-medium text-gray-800">
          Profile Information
        </h2>
        <div className="flex space-x-2">
          <button
            type="submit"
            className="hidden w-full sm:w-auto cursor-pointer bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white px-3 py-2 rounded-md text-sm sm:flex items-center justify-center transition-all duration-200 shadow-md"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="animate-spin mr-2">↻</span>
            ) : (
              <Save size={16} className="mr-2" />
            )}
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div
            className="w-20 h-20 rounded-full overflow-hidden bg-blue-50 flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity flex-shrink-0"
            onClick={() => hasExistingImage && handleViewProfilePicture()}
          >
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Profile"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://via.placeholder.com/400x400?text=Image+Error";
                  e.currentTarget.alt = "Failed to load image";
                }}
              />
            ) : (
              <User size={20} className="text-gray-400" />
            )}
          </div>
          <div className="space-y-2 w-full text-center sm:text-left">
            <h3 className="font-medium text-gray-800">Profile Picture</h3>
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
              <button
                type="button"
                className="cursor-pointer bg-white hover:bg-blue-50 text-blue-800 px-3 py-1.5 rounded-md text-sm flex items-center transition-colors duration-200 border border-blue-200"
                onClick={triggerFileInput}
              >
                <Upload size={14} className="mr-1" />
                {previewUrl ? "Change Photo" : "Upload Photo"}
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              {previewUrl && (
                <button
                  type="button"
                  className="cursor-pointer bg-white hover:bg-red-50 text-red-600 px-3 py-1.5 rounded-md text-sm flex items-center transition-colors duration-200 border border-red-200"
                  onClick={removeProfilePicture}
                >
                  <X size={14} className="mr-1" />
                  Remove
                </button>
              )}
            </div>
            {errors.profilePicture && (
              <p className="text-red-500 text-xs mt-1">
                {errors.profilePicture}
              </p>
            )}
            <p className="text-xs text-gray-500">
              Recommended: Square JPG or PNG, max 2MB
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            First Name*
          </label>
          <input
            id="firstName"
            type="text"
            name="firstName"
            value={userData.firstName}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border ${
              errors.firstName ? "border-red-500" : "border-blue-200"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800`}
          />
          {errors.firstName && (
            <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
          )}
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Last Name*
          </label>
          <input
            id="lastName"
            type="text"
            name="lastName"
            value={userData.lastName}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border ${
              errors.lastName ? "border-red-500" : "border-blue-200"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800`}
          />
          {errors.lastName && (
            <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
          )}
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email Address
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={userData.email}
            disabled
            className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none bg-gray-100 text-gray-500 cursor-not-allowed"
          />
          <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
        </div>
        <div className="flex space-x-2">
          <button
            type="submit"
            className="flex w-full sm:w-auto cursor-pointer bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white px-3 py-2 rounded-md text-sm sm:hidden items-center justify-center transition-all duration-200 shadow-md"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="animate-spin mr-2">↻</span>
            ) : (
              <Save size={16} className="mr-2" />
            )}
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {enlargedImageUrl && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 p-2 sm:p-4 transition-all duration-300"
          onClick={() => setEnlargedImageUrl(null)}
          style={{
            animation: "fadeIn 0.3s ease-out forwards",
          }}
        >
          <div
            className="relative border-2 border-blue-800 max-w-full sm:max-w-xl md:max-w-2xl lg:max-w-4xl w-full rounded-xl overflow-hidden shadow-2xl bg-white transform transition-all duration-300"
            onClick={(e) => e.stopPropagation()}
            style={{
              animation: "zoomIn 0.3s ease-out forwards",
            }}
          >
            <div className="relative">
              <img
                src={enlargedImageUrl}
                alt="Profile"
                className="w-full max-h-[80vh] object-contain"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://via.placeholder.com/400x400?text=Image+Error";
                  e.currentTarget.alt = "Failed to load image";
                }}
              />

              <button
                className="absolute top-3 right-3 cursor-pointer hover:bg-opacity-70 text-white rounded-full p-2 transition-all duration-200 transform hover:scale-105"
                onClick={() => setEnlargedImageUrl(null)}
                aria-label="Close modal"
              >
                <X size={16} className="sm:hidden" />
                <X size={20} className="hidden sm:block" strokeWidth={2.5} />
              </button>

              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent text-white p-3 sm:p-4 flex justify-between items-center">
                <div className="text-xs sm:text-sm font-medium opacity-90">
                  Profile Photo
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Toaster position="bottom-left" richColors />

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes zoomIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        /* Add responsive adjustments */
        @media (max-width: 640px) {
          .max-w-4xl {
            max-width: 95%;
          }
        }
      `}</style>
    </form>
  );
}

export default ProfileTab;
