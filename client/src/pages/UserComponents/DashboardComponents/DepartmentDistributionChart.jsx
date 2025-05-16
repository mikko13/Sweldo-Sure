import React, { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

function DepartmentDistributionChart({ employees }) {
  const departmentData = useMemo(() => {
    if (!employees || employees.length === 0) {
      return [];
    }

    const departments = {};

    employees.forEach((employee) => {
      const dept = employee.department || "Unassigned";
      if (departments[dept]) {
        departments[dept]++;
      } else {
        departments[dept] = 1;
      }
    });

    return Object.keys(departments).map((name) => ({
      name,
      value: departments[name],
    }));
  }, [employees]);

  const COLORS = [
    "#4361ee",
    "#3f37c9",
    "#4895ef",
    "#4cc9f0",
    "#560bad",
    "#480ca8",
    "#3a0ca3",
    "#3f37c9",
    "#4361ee",
    "#4895ef",
    "#4cc9f0",
    "#7209b7",
  ];

  function CustomTooltip({ active, payload }) {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-md rounded-md border border-blue-100">
          <p className="font-medium text-gray-800">{payload[0].name}</p>
          <p className="text-blue-600">{`${
            payload[0].value
          } employees (${Math.round(
            (payload[0].value / employees.length) * 100
          )}%)`}</p>
        </div>
      );
    }
    return null;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-blue-100 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-blue-800">
          Department Distribution
        </h2>
        <div className="flex items-center text-sm text-gray-500">
          <span className="bg-blue-50 text-blue-800 px-2 py-1 rounded-full text-xs">
            {departmentData.length} departments
          </span>
        </div>
      </div>

      {departmentData.length > 0 ? (
        <div className="flex-1 min-h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={departmentData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} (${(percent * 100).toFixed(0)}%)`
                }
                labelLine={false}
              >
                {departmentData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    className="hover:opacity-90 transition-opacity duration-200"
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                wrapperStyle={{ paddingTop: "20px" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center border-t border-blue-100 pt-4">
          <div className="text-center text-gray-500">
            <p>No department data available</p>
            <p className="text-sm text-gray-400 mt-2">
              Add employees with department information to see the distribution
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default DepartmentDistributionChart;
