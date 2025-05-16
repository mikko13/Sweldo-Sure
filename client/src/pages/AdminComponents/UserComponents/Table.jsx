import { useState } from "react";
import { Edit, Trash, User, X, Power } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import PaginationComponent from "./Pagination";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

function UserTable({
  displayedUsers,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  setItemsPerPage,
  filteredUsers,
  users,
  setUsers,
}) {
  const [userToDelete, setUserToDelete] = useState(null);
  const [userToToggleStatus, setUserToToggleStatus] = useState(null);
  const [enlargedImageUrl, setEnlargedImageUrl] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [updatedProfilePictures, setUpdatedProfilePictures] = useState({});
  const navigate = useNavigate();

  function handleViewProfilePicture(userId) {
    const imageUrl =
      "http://localhost:5000/api/users/" +
        userId +
        "/" +
        "profile-picture?" +
        updatedProfilePictures[userId] || Date.now();
    setEnlargedImageUrl(imageUrl);
  }

  function handleEditUser(user) {
    navigate("/admin-user-accounts/admin-update-user-accounts/" + user.id, {
      state: { user },
    });
  }

  async function handleDeleteUser() {
    if (!userToDelete) return;

    try {
      await axios.delete("http://localhost:5000/api/users/" + userToDelete.id);

      const updatedUsers = users.filter((user) => user.id !== userToDelete.id);
      setUsers(updatedUsers);

      toast.success("User Deleted", {
        description:
          userToDelete.firstName +
          " " +
          userToDelete.lastName +
          " has been removed from the system.",
      });

      setUserToDelete(null);
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Delete Failed", {
        description: "An error occurred while deleting the user.",
      });
    }
  }

  async function handleToggleUserStatus() {
    if (!userToToggleStatus) return;

    try {
      await axios.patch(
        "http://localhost:5000/api/users/" +
          userToToggleStatus.id +
          "/toggle-status"
      );

      const updatedUsers = users.map((u) =>
        u.id === userToToggleStatus.id ? { ...u, isActive: !u.isActive } : u
      );
      setUsers(updatedUsers);

      toast.success(
        userToToggleStatus.isActive ? "User Deactivated" : "User Activated",
        {
          description:
            userToToggleStatus.firstName +
            " " +
            userToToggleStatus.lastName +
            " has been " +
            (userToToggleStatus.isActive ? "deactivated" : "activated") +
            ".",
        }
      );

      setUserToToggleStatus(null);
      setStatusDialogOpen(false);
    } catch (error) {
      console.error("Error toggling user status:", error);
      toast.error("Status Update Failed", {
        description: "An error occurred while updating the user status.",
      });
    }
  }

  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  return (
    <>
      <div className="relative flex-1 overflow-auto p-4">
        <div className="rounded-lg overflow-hidden shadow animate-fadeIn bg-white border border-blue-100">
          <div className="overflow-x-auto">
            <table className="w-full relative">
              <thead>
                <tr className="text-xs text-gray-500 border-b border-blue-100 bg-blue-50">
                  <th className="p-3 text-left font-medium">Photo</th>
                  <th className="p-3 text-left font-medium">First Name</th>
                  <th className="p-3 text-left font-medium">Last Name</th>
                  <th className="p-3 text-left font-medium">Email</th>
                  <th className="p-3 text-left font-medium">Status</th>
                  <th className="p-3 text-left font-medium">Created</th>
                  <th className="p-3 text-left font-medium">Updated</th>
                  <th className="p-3 text-left font-medium sticky right-0 bg-blue-50 z-10">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {displayedUsers
                  .filter((user) => user.role !== "admin")
                  .map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-blue-50 hover:bg-blue-50 transition-all duration-200 animate-fadeIn"
                    >
                      <td className="p-3 text-sm text-gray-800">
                        <div
                          className="w-10 h-10 rounded-full overflow-hidden bg-blue-50 flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() =>
                            user.profilePicture?.hasImage &&
                            handleViewProfilePicture(user.id)
                          }
                        >
                          {user.profilePicture?.hasImage ? (
                            <img
                              src={
                                "http://localhost:5000/api/users/" +
                                user.id +
                                "/profile-picture?" +
                                (updatedProfilePictures[user.id] || Date.now())
                              }
                              alt={user.firstName + "'s profile"}
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
                      </td>
                      <td className="p-3 text-sm text-gray-800">
                        {user.firstName}
                      </td>
                      <td className="p-3 text-sm text-gray-800">
                        {user.lastName}
                      </td>
                      <td className="p-3 text-sm text-gray-800">
                        {user.email}
                      </td>
                      <td className="p-3 text-sm">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {user.isActive ? "Active" : "Deactivated"}
                        </span>
                      </td>
                      <td className="p-3 text-sm text-gray-800">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="p-3 text-sm text-gray-800">
                        {formatDate(user.updatedAt)}
                      </td>
                      <td className="p-3 sticky right-0 bg-white z-10">
                        <div className="flex items-center space-x-2">
                          <button
                            className="p-1.5 bg-blue-50 hover:bg-blue-100 rounded-md text-gray-600 hover:text-blue-700 transition-all duration-200 cursor-pointer"
                            onClick={() => handleEditUser(user)}
                          >
                            <Edit size={16} />
                          </button>

                          <button
                            className={`p-1.5 rounded-md transition-all duration-200 cursor-pointer ${
                              user.isActive
                                ? "bg-red-50 hover:bg-red-100 text-gray-600 hover:text-red-600"
                                : "bg-green-50 hover:bg-green-100 text-gray-600 hover:text-green-600"
                            }`}
                            onClick={() => {
                              setUserToToggleStatus(user);
                              setStatusDialogOpen(true);
                            }}
                            title={
                              user.isActive
                                ? "Deactivate User"
                                : "Activate User"
                            }
                          >
                            <Power size={16} />
                          </button>

                          <button
                            className="p-1.5 bg-blue-50 hover:bg-blue-100 rounded-md text-gray-600 hover:text-red-600 transition-all duration-200 cursor-pointer"
                            onClick={() => {
                              setUserToDelete(user);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Trash size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <PaginationComponent
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalItems={filteredUsers.length}
          />
        </div>
      </div>

      <AlertDialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {userToToggleStatus?.isActive
                ? "Deactivate User?"
                : "Activate User?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {userToToggleStatus?.isActive
                ? `This will deactivate ${userToToggleStatus?.firstName} ${userToToggleStatus?.lastName}'s account. They won't be able to access the system until their account is reactivated.`
                : `This will activate ${userToToggleStatus?.firstName} ${userToToggleStatus?.lastName}'s account. They will regain access to the system.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="cursor-pointer"
              onClick={() => setStatusDialogOpen(false)}
            >
              Cancel
            </AlertDialogCancel>
            <Button
              variant={userToToggleStatus?.isActive ? "destructive" : "default"}
              onClick={handleToggleUserStatus}
              className={`cursor-pointer ${
                !userToToggleStatus?.isActive
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : ""
              }`}
            >
              {userToToggleStatus?.isActive ? "Deactivate" : "Activate"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              user account for{" "}
              <strong>
                {userToDelete?.firstName} {userToDelete?.lastName}
              </strong>{" "}
              from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="cursor-pointer"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={handleDeleteUser}
              className="cursor-pointer"
            >
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {enlargedImageUrl && (
        <div
          className="mt-0 md:mt-45 fixed inset-0 flex items-center justify-center z-50 p-4 transition-all duration-300"
          onClick={() => setEnlargedImageUrl(null)}
          style={{
            animation: "fadeIn 0.3s ease-out forwards",
          }}
        >
          <div
            className="relative  border-2 border-blue-800 max-w-4xl w-full rounded-xl overflow-hidden shadow-2xl bg-white transform transition-all duration-300"
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
                className="absolute top-3 right-3 bg-black bg-opacity-30 cursor-pointer hover:bg-opacity-60 text-white rounded-full p-2 transition-all duration-200 transform hover:scale-105"
                onClick={() => setEnlargedImageUrl(null)}
                aria-label="Close modal"
              >
                <X size={20} strokeWidth={2.5} />
              </button>

              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent text-white p-4 flex justify-between items-center">
                <div className="text-sm font-medium opacity-90">Photo</div>
                <div className="flex space-x-3"></div>
              </div>
            </div>
          </div>
        </div>
      )}

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
    </>
  );
}

export default UserTable;
