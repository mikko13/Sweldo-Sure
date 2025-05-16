import { useState, useEffect, useCallback } from "react";
import {
  FileText,
  Users,
  Search,
  Filter,
  Plus,
  X,
  ChevronDown,
  Check,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function EmployeeActions({
  searchQuery,
  setSearchQuery,
  displayedEmployees,
  employees,
  setFilteredEmployees,
}) {
  const [mobileActionsOpen, setMobileActionsOpen] = useState(false);
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [activeFilterSection, setActiveFilterSection] = useState(null);
  const [filters, setFilters] = useState({
    department: "",
    position: "",
    status: "",
    remarks: "",
  });
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event) {
      const target = event.target;
      if (
        !target.closest(".filter-dropdown") &&
        !target.closest(".filter-button")
      ) {
        setFilterDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  const uniqueDepartments = [
    ...new Set(employees.map((emp) => emp.department).filter(Boolean)),
  ].sort();

  const uniquePositions = [
    ...new Set(employees.map((emp) => emp.position).filter(Boolean)),
  ].sort();

  const uniqueStatuses = [
    ...new Set(employees.map((emp) => emp.status).filter(Boolean)),
  ].sort();

  const uniqueRemarks = [
    ...new Set(employees.map((emp) => emp.remarks).filter(Boolean)),
  ].sort();

  const applyFilters = useCallback(() => {
    const filteredData = employees.filter((employee) => {
      const matchesSearch =
        searchQuery === "" ||
        employee.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.middleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        `${employee.firstName} ${employee.middleName} ${employee.lastName}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

      const matchesDepartment =
        !filters.department || employee.department === filters.department;

      const matchesPosition =
        !filters.position || employee.position === filters.position;

      const matchesStatus =
        !filters.status || employee.status === filters.status;

      const matchesRemarks =
        !filters.remarks || employee.remarks === filters.remarks;

      return (
        matchesSearch &&
        matchesDepartment &&
        matchesPosition &&
        matchesStatus &&
        matchesRemarks
      );
    });

    setFilteredEmployees(filteredData);
  }, [employees, searchQuery, filters, setFilteredEmployees]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const filterSections = [
    {
      label: "Department",
      key: "department",
      options: uniqueDepartments,
    },
    {
      label: "Position",
      key: "position",
      options: uniquePositions,
    },
    {
      label: "Status",
      key: "status",
      options: uniqueStatuses,
    },
    {
      label: "Remarks",
      key: "remarks",
      options: uniqueRemarks,
    },
  ];

  function resetFilters() {
    setFilters({
      department: "",
      position: "",
      status: "",
      remarks: "",
    });
    setSearchQuery("");
    setFilteredEmployees(employees);
    setFilterDropdownOpen(false);

    toast.success("Filters Reset", {
      description: "All filters have been cleared.",
      duration: 2000,
    });
  }

  function handleFilterChange(key, value) {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key] === value ? "" : value,
    }));
  }

  function getActiveFiltersCount() {
    return Object.values(filters).filter(Boolean).length;
  }

  function generatePDF() {
    try {
      const doc = new jsPDF("landscape");
      const pageWidth = doc.internal.pageSize.getWidth();

      const internalDoc = doc.internal;

      doc.setFillColor(51, 102, 204);
      doc.rect(0, 0, pageWidth, 25, "F");
      doc.setFont("helvetica", "bold");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.text("Century Park Hotel GLS Staff Data Based", 14, 15);

      const today = new Date();
      const dateStr = today.toLocaleDateString();
      doc.setFontSize(10);
      doc.text(`As of: ${dateStr}`, pageWidth - 14, 10, { align: "right" });

      doc.setTextColor(100, 100, 100);
      doc.setFontSize(10);
      doc.text("GLS Manpower Services", 14, 35);
      doc.text(
        "Suite 19 G/F Midland Plaza, M. Adriatico Street, Ermita, City of Manila 1000 Metro Manila",
        14,
        40
      );
      doc.text("gls_manpowerservices@yahoo.com | +63 (2) 8 526 5813", 14, 45);
      doc.setDrawColor(220, 220, 220);
      doc.setFillColor(245, 245, 250);
      doc.roundedRect(pageWidth - 80, 30, 70, 20, 3, 3, "FD");
      doc.setTextColor(50, 50, 50);
      doc.setFontSize(11);
      doc.text("Total Employees:", pageWidth - 75, 38);
      doc.setFont("helvetica", "bold");
      doc.text(`${displayedEmployees.length}`, pageWidth - 30, 38);

      const columns = [
        { header: "Last Name", dataKey: "lastName" },
        { header: "First Name", dataKey: "firstName" },
        { header: "Middle Name", dataKey: "middleName" },
        { header: "Gender", dataKey: "gender" },
        { header: "Position", dataKey: "position" },
        { header: "Department", dataKey: "department" },
        { header: "Date Started", dataKey: "dateStarted" },
        { header: "Rate", dataKey: "rate" },
        { header: "Civil Status", dataKey: "civilStatus" },
        { header: "Birthday", dataKey: "birthDate" },
        { header: "SSS Number", dataKey: "sss" },
        { header: "HDMF/PAGIBIG", dataKey: "hdmf" },
        { header: "Philhealth", dataKey: "philhealth" },
        { header: "Tin Number", dataKey: "tin" },
        { header: "Email Address", dataKey: "emailAddress" },
        { header: "Permanent Address", dataKey: "permanentAddress" },
        { header: "Contact Number", dataKey: "contactNumber" },
        { header: "Status", dataKey: "status" },
        { header: "Remarks", dataKey: "remarks" },
      ];

      function formatStatus(status) {
        return status.charAt(0).toUpperCase() + status.slice(1);
      }

      autoTable(doc, {
        startY: 55,
        head: [columns.map((col) => col.header)],
        body: displayedEmployees.map((employee) => [
          employee.lastName,
          employee.firstName,
          employee.middleName,
          employee.gender,
          employee.position,
          employee.department,
          employee.dateStarted,
          employee.rate,
          employee.civilStatus || "",
          employee.birthDate || "",
          employee.sss || "",
          employee.hdmf || "",
          employee.philhealth || "",
          employee.tin || "",
          employee.emailAddress || "",
          employee.permanentAddress || "",
          employee.contactNumber || "",
          formatStatus(employee.status),
          employee.remarks,
        ]),
        theme: "grid",
        headStyles: {
          fillColor: [73, 137, 222],
          textColor: [255, 255, 255],
          fontStyle: "bold",
          halign: "center",
          fontSize: 8,
        },
        bodyStyles: {
          fontSize: 7,
        },
        alternateRowStyles: {
          fillColor: [240, 245, 255],
        },
        styles: {
          lineColor: [220, 220, 220],
          lineWidth: 0.1,
          cellPadding: 2,
          overflow: "linebreak",
        },
        columnStyles: {
          15: {
            cellWidth: "auto",
            overflow: "linebreak",
          },
          18: {
            cellWidth: "auto",
            overflow: "linebreak",
          },
        },
        didDrawPage: () => {
          const pageCount = internalDoc.getNumberOfPages();
          doc.setFontSize(8);
          doc.setTextColor(100, 100, 100);
          for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.text(
              "Page " + i + " of " + pageCount,
              pageWidth / 2,
              doc.internal.pageSize.getHeight() - 10,
              {
                align: "center",
              }
            );
            doc.text(
              "CONFIDENTIAL - FOR INTERNAL USE ONLY",
              14,
              doc.internal.pageSize.getHeight() - 10
            );
          }
        },
      });

      doc.save("employee-complete-report.pdf");

      toast.success("PDF Generated", {
        description:
          "Employee report for " +
          displayedEmployees.length +
          " employees has been created.",
        duration: 3000,
      });
    } catch (error) {
      toast.error("PDF Generation Failed", {
        description: "There was an error creating the employee report.",
        duration: 3000,
      });
      console.error("PDF generation error:", error);
    }
  }

  return (
    <div
      className="p-4 transition-all duration-500 ease-out z-[60]" // Increased z-index to 60
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(10px)",
      }}
    >
      <div className="hidden md:flex justify-between items-center">
        <div className="flex space-x-2">
          <button
            className="bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white px-3 py-2 rounded-md text-sm flex items-center shadow-md cursor-pointer transition-all duration-200"
            onClick={() => navigate("/Employees/AddEmployee")}
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(5px)",
              transition: "opacity 500ms ease-out, transform 500ms ease-out",
              transitionDelay: "300ms",
            }}
          >
            <Users size={16} className="mr-2" />
            Add Employee
          </button>
          <button
            onClick={generatePDF}
            className="bg-white hover:bg-blue-50 text-gray-800 px-3 py-2 rounded-md text-sm flex items-center border border-blue-200 cursor-pointer transition-all duration-200"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(5px)",
              transition: "opacity 500ms ease-out, transform 500ms ease-out",
              transitionDelay: "400ms",
            }}
          >
            <FileText size={16} className="mr-2" />
            Generate PDF
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <div
            className="relative"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateX(0)" : "translateX(10px)",
              transition: "opacity 500ms ease-out, transform 500ms ease-out",
              transitionDelay: "300ms",
            }}
          >
            <input
              type="text"
              placeholder="Search employees..."
              className="bg-white text-gray-800 px-3 py-2 rounded-md text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-blue-200 transition-all duration-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search
              size={16}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
          </div>

          <div
            className="relative"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateX(0)" : "translateX(10px)",
              transition: "opacity 500ms ease-out, transform 500ms ease-out",
              transitionDelay: "400ms",
            }}
          ></div>
        </div>
      </div>

      <div className="md:hidden">
        <div className="flex justify-between items-center">
          <div
            className="relative flex-1 mr-2"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(5px)",
              transition: "opacity 500ms ease-out, transform 500ms ease-out",
              transitionDelay: "300ms",
            }}
          >
            <input
              type="text"
              placeholder="Search employees..."
              className="bg-white text-gray-800 px-3 py-2 rounded-md text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 border border-blue-200 transition-all duration-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search
              size={16}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeActions;
