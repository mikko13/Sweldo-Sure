import { useState } from "react";
import TabButton from "./TabButton";
import PositionsTab from "./PositionsTab";
import DepartmentsTab from "./DepartmentsTab";
import { Briefcase, Building2 } from "lucide-react";

function SystemSettingsContent({
  positions,
  departments,
  newPosition,
  newDepartment,
  setNewPosition,
  setNewDepartment,
  handleAddPosition,
  handleAddDepartment,
  handleDeletePosition,
  handleDeleteDepartment,
  handleUpdatePosition,
  handleUpdateDepartment,
  handleTogglePositionStatus,
  handleToggleDepartmentStatus,
}) {
  const [activeTab, setActiveTab] = useState("positions");

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="bg-white rounded-lg shadow border border-blue-100 overflow-hidden">
        <div className="flex border-b border-blue-100">
          <TabButton
            icon={Briefcase}
            label="Positions"
            isActive={activeTab === "positions"}
            onClick={() => setActiveTab("positions")}
          />
          <TabButton
            icon={Building2}
            label="Departments"
            isActive={activeTab === "departments"}
            onClick={() => setActiveTab("departments")}
          />
        </div>

        <div className="p-6">
          {activeTab === "positions" && (
            <PositionsTab
              positions={positions}
              newPosition={newPosition}
              setNewPosition={setNewPosition}
              handleAddPosition={handleAddPosition}
              handleDeletePosition={handleDeletePosition}
              handleUpdatePosition={handleUpdatePosition}
              handleTogglePositionStatus={handleTogglePositionStatus}
            />
          )}
          {activeTab === "departments" && (
            <DepartmentsTab
              departments={departments}
              newDepartment={newDepartment}
              setNewDepartment={setNewDepartment}
              handleAddDepartment={handleAddDepartment}
              handleDeleteDepartment={handleDeleteDepartment}
              handleUpdateDepartment={handleUpdateDepartment}
              handleToggleDepartmentStatus={handleToggleDepartmentStatus}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default SystemSettingsContent;
