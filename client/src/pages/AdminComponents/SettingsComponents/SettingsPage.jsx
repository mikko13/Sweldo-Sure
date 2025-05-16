import { useState, useEffect } from "react";
import Sidebar from "../SidebarComponents/Sidebar";
import Header from "../HeaderComponents/Header";
import MainContent from "./MainContent";
import axios from "axios";
import { toast } from "sonner";

function SettingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userId, setUserId] = useState("");
  const [activeSidebarItem, setActiveSidebarItem] = useState("Settings");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    position: "",
    department: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    async function fetchCurrentUser() {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/users/current",
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );
        setFormData({
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          email: response.data.email,
          phone: response.data.phone || "",
          position: response.data.position || "",
          department: response.data.department || "",
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setUserId(response.data._id);
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to load user data");
      }
    }

    fetchCurrentUser();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await axios.put(
        "http://localhost:5000/api/users/current",
        formData,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Sidebar
        sidebarOpen={sidebarOpen}
        activeSidebarItem={activeSidebarItem}
        setActiveSidebarItem={setActiveSidebarItem}
        setSidebarOpen={setSidebarOpen}
      />
      <div
        className="flex-1 flex flex-col h-screen overflow-hidden"
        style={{ background: "linear-gradient(135deg, #f8fafc, #f0f4f8)" }}
      >
        <Header />
        <MainContent
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          userId={userId}
        />
      </div>
    </div>
  );
}

export default SettingsPage;
