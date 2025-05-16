import { useState, useEffect } from "react";
import Sidebar from "../SidebarComponents/Sidebar";
import Header from "../HeaderComponents/Header";
import SystemSettingsContent from "./SystemSettingsContent";
import axios from "axios";
import { toast } from "sonner";

function SystemSettingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSidebarItem, setActiveSidebarItem] = useState("System Settings");

  const [positions, setPositions] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [newPosition, setNewPosition] = useState("");
  const [newDepartment, setNewDepartment] = useState("");

  useEffect(() => {
    fetchPositionsAndDepartments();
  }, []);

  async function fetchPositionsAndDepartments() {
    try {
      const positionsResponse = await axios.get(
        "https://sweldo-sure-server.onrender.com/#/api/system/positions",
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      const departmentsResponse = await axios.get(
        "https://sweldo-sure-server.onrender.com/#/api/system/departments",
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      setPositions(positionsResponse.data.data);
      setDepartments(departmentsResponse.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load system settings data");
    }
  }

  async function handleAddPosition() {
    if (!newPosition.trim()) {
      toast.error("Position name cannot be empty");
      return;
    }

    try {
      await axios.post(
        "https://sweldo-sure-server.onrender.com/#/api/system/positions",
        { title: newPosition },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      setNewPosition("");
      fetchPositionsAndDepartments();
      toast.success("Position added successfully");
    } catch (error) {
      console.error("Error adding position:", error);
      toast.error("Failed to add position");
    }
  }

  async function handleUpdatePosition(id, title) {
    try {
      const position = positions.find((p) => p._id === id);
      if (!position) return;

      await axios.put(
        "https://sweldo-sure-server.onrender.com/#/api/system/positions/" + id,
        { title, isActive: position.isActive },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      fetchPositionsAndDepartments();
      toast.success("Position updated successfully");
    } catch (error) {
      console.error("Error updating position:", error);
      toast.error("Failed to update position");
    }
  }

  async function handleUpdateDepartment(id, name) {
    try {
      const department = departments.find((p) => p._id === id);
      if (!department) return;

      await axios.put(
        "https://sweldo-sure-server.onrender.com/#/api/system/departments/" + id,
        { name, isActive: department.isActive },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      fetchPositionsAndDepartments();
      toast.success("department updated successfully");
    } catch (error) {
      console.error("Error updating department:", error);
      toast.error("Failed to update department");
    }
  }

  async function handleTogglePositionStatus(id, currentStatus) {
    try {
      await axios.patch(
        "https://sweldo-sure-server.onrender.com/#/api/system/positions/" + id + "/toggle",
        {},
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      fetchPositionsAndDepartments();
      toast.success("Position status updated");
      return Promise.resolve();
    } catch (error) {
      console.error("Error toggling position status:", error);
      toast.error("Failed to update position status");
      return Promise.reject(error);
    }
  }

  async function handleToggleDepartmentStatus(id, currentStatus) {
    try {
      await axios.patch(
        "https://sweldo-sure-server.onrender.com/#/api/system/departments/" + id + "/toggle",
        {},
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      fetchPositionsAndDepartments();
      toast.success("Department status updated");
      return Promise.resolve();
    } catch (error) {
      console.error("Error toggling department status:", error);
      toast.error("Failed to update department status");
      return Promise.reject(error);
    }
  }

  async function handleAddDepartment() {
    if (!newDepartment.trim()) {
      toast.error("Department name cannot be empty");
      return;
    }

    try {
      await axios.post(
        "https://sweldo-sure-server.onrender.com/#/api/system/departments",
        { name: newDepartment },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      setNewDepartment("");
      fetchPositionsAndDepartments();
      toast.success("Department added successfully");
    } catch (error) {
      console.error("Error adding department:", error);
      toast.error("Failed to add department");
    }
  }

  async function handleDeletePosition(positionId) {
    try {
      await axios.delete(
        "https://sweldo-sure-server.onrender.com/#/api/system/positions/" + positionId,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      fetchPositionsAndDepartments();
      toast.success("Position deleted successfully");
    } catch (error) {
      console.error("Error deleting position:", error);
      toast.error("Failed to delete position");
    }
  }

  async function handleDeleteDepartment(departmentId) {
    try {
      await axios.delete(
        "https://sweldo-sure-server.onrender.com/#/api/system/departments/" + departmentId,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      fetchPositionsAndDepartments();
      toast.success("Department deleted successfully");
    } catch (error) {
      console.error("Error deleting department:", error);
      toast.error("Failed to delete department");
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
        <SystemSettingsContent
          positions={positions}
          departments={departments}
          newPosition={newPosition}
          newDepartment={newDepartment}
          setNewPosition={setNewPosition}
          setNewDepartment={setNewDepartment}
          handleAddPosition={handleAddPosition}
          handleAddDepartment={handleAddDepartment}
          handleDeletePosition={handleDeletePosition}
          handleDeleteDepartment={handleDeleteDepartment}
          handleUpdatePosition={handleUpdatePosition}
          handleUpdateDepartment={handleUpdateDepartment}
          handleTogglePositionStatus={handleTogglePositionStatus}
          handleToggleDepartmentStatus={handleToggleDepartmentStatus}
        />
      </div>
    </div>
  );
}

export default SystemSettingsPage;
