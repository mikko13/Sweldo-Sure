import React, { useState, useEffect } from "react";
import { User } from "lucide-react";
import authService from "../../services/authService";

function UserAvatar() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageVersion, setImageVersion] = useState(Date.now());

  useEffect(() => {
    async function fetchUserData() {
      try {
        setLoading(true);
        const user = await authService.getCurrentUser();
        setUserData(user);
        setError(null);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load user data");
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setImageVersion(Date.now());
    }, 300000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center space-x-2 group cursor-pointer animate-pulse">
        <div className="w-8 h-8 rounded-full bg-gray-200"></div>
        <div className="h-4 w-20 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="flex items-center space-x-2 group cursor-pointer">
        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white">
          <User size={16} />
        </div>
        <span className="text-gray-800">User</span>
      </div>
    );
  }

  const initials =
    userData.firstName.charAt(0).toUpperCase() +
    userData.lastName.charAt(0).toUpperCase();
  const userId = userData.id || userData._id;
  const hasProfilePicture = userData.profilePicture?.hasImage;

  return (
    <div className="flex items-center space-x-2 group cursor-pointer">
      <div className="border-2 border-blue-800 w-8 h-8 rounded-full overflow-hidden flex items-center justify-center shadow group-hover:shadow-md transition-all duration-300">
        {hasProfilePicture && userId ? (
          <div className="w-full h-full bg-gradient-to-br from-blue-700 to-blue-900 flex items-center justify-center text-white">
            {initials}
          </div>
        ) : (
          <img
            src={
              "https://sweldo-sure-server.onrender.com/api/users/" +
              userId +
              "/profile-picture?" +
              imageVersion
            }
            alt={userData.firstName + "'s profile"}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              const parent = e.currentTarget.parentElement;
              if (parent) {
                parent.classList.add(
                  "bg-gradient-to-br",
                  "from-blue-700",
                  "to-blue-900",
                  "text-white"
                );
                parent.innerHTML = initials;
              }
            }}
          />
        )}
      </div>
      <span className="text-gray-800 group-hover:text-blue-800 transition-colors duration-200">
        {userData.firstName} {userData.lastName}
      </span>
    </div>
  );
}

export default UserAvatar;
