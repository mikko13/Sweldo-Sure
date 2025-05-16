import React, { useState, useEffect } from "react";
import {
  Save,
  ArrowLeft,
  User,
  Briefcase,
  CreditCard,
  Phone,
  Loader,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, Toaster } from "sonner";

function CreateEmployeeForm({ onSubmit, onCancel }) {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    lastName: "",
    firstName: "",
    middleName: "",
    gender: "Male",
    position: "",
    department: "",
    dateStarted: "",
    rate: "80.625",
    civilStatus: "Single",
    birthDate: "",
    sss: "",
    hdmf: "",
    philhealth: "",
    tin: "",
    emailAddress: "",
    permanentAddress: "",
    contactNumber: "",
    status: "Regular",
    remarks: "Active",
  });

  useEffect(() => {
    async function fetchDepartmentsAndPositions() {
      try {
        setIsLoading(true);

        const departmentsResponse = await axios.get(
          "https://sweldo-sure-server.onrender.com/#/api/system/departments"
        );
        const departmentsData = departmentsResponse.data.data || [];
        setDepartments(departmentsData.filter((dept) => dept.isActive));

        const positionsResponse = await axios.get(
          "https://sweldo-sure-server.onrender.com/#/api/system/positions"
        );
        const positionsData = positionsResponse.data.data || [];
        setPositions(positionsData.filter((pos) => pos.isActive));
      } catch (err) {
        console.error("Error fetching data:", err);
        toast.error("Failed to load departments and positions", {
          description: "Please try refreshing the page.",
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchDepartmentsAndPositions();
  }, []);

  function validateForm() {
    const newErrors = {};

    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.birthDate) newErrors.birthDate = "Birth date is required";

    if (formData.birthDate) {
      const today = new Date();
      const birthDate = new Date(formData.birthDate);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      if (age < 18) {
        newErrors.birthDate = "Employee must be at least 18 years old";
      }
    }

    if (!formData.position.trim()) newErrors.position = "Position is required";
    if (!formData.department.trim())
      newErrors.department = "Department is required";
    if (!formData.dateStarted)
      newErrors.dateStarted = "Date started is required";

    if (!formData.rate.trim()) {
      newErrors.rate = "Rate is required";
    } else if (isNaN(Number(formData.rate)) || Number(formData.rate) <= 0) {
      newErrors.rate = "Rate must be a valid positive number";
    }

    if (!formData.emailAddress.trim()) {
      newErrors.emailAddress = "Email address is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.emailAddress.trim())) {
        newErrors.emailAddress = "Please enter a valid email address";
      }
    }

    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = "Contact number is required";
    } else {
      const phoneRegex = /^\+?[0-9]{10,15}$/;
      if (!phoneRegex.test(formData.contactNumber.replace(/[\s-]/g, ""))) {
        newErrors.contactNumber = "Please enter a valid contact number";
      }
    }

    if (!formData.permanentAddress.trim()) {
      newErrors.permanentAddress = "Permanent address is required";
    } else if (formData.permanentAddress.trim().length < 10) {
      newErrors.permanentAddress = "Please enter a complete address";
    }

    return newErrors;
  }

  function handleChange(e) {
    const { name, value } = e.target;

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }

    if (name === "rate") {
      const regex = /^[0-9]*\.?[0-9]*$/;
      if (value === "" || regex.test(value)) {
        setFormData({ ...formData, [name]: value });
      }
      return;
    }

    setFormData({ ...formData, [name]: value });
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
      const response = await axios.post(
        "https://sweldo-sure-server.onrender.com/#/api/employees",
        formData
      );

      toast.success("Employee created successfully!", {
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
        navigate("/Employees", {
          state: { message: "Employee created successfully!", type: "success" },
        });
      }, 3000);
    } catch (err) {
      console.error("Error creating employee:", err);

      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || "Failed to create employee");
        toast.error("Failed to create employee", {
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

  function getRemarksColor(remarks) {
    switch (remarks) {
      case "Active":
        return "bg-emerald-100 text-emerald-800";
      case "On leave":
        return "bg-amber-100 text-amber-800";
      case "Inactive":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader size={40} className="text-blue-600 animate-spin" />
          <p className="mt-4 text-blue-800 font-medium">Loading data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="h-full w-full p-4 md:p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <button
              onClick={() => navigate("/Employees")}
              className="mr-3 p-2 rounded-full hover:bg-blue-100 transition-colors text-blue-600 cursor-pointer"
              aria-label="Go back"
            >
              <ArrowLeft size={20} />
            </button>
            <h2 className="text-xl md:text-2xl font-bold text-blue-800">
              Create New Employee
            </h2>
          </div>
          <div className="flex items-center">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${getRemarksColor(
                formData.remarks
              )}`}
            >
              {formData.remarks}
            </span>
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
                Personal Information
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  htmlFor="middleName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Middle Name
                </label>
                <input
                  type="text"
                  id="middleName"
                  name="middleName"
                  value={formData.middleName}
                  onChange={handleChange}
                  className="w-full rounded-md border border-blue-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  placeholder="Enter middle name"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="gender"
                  className="block text-sm font-medium text-gray-700"
                >
                  Gender*
                </label>
                <select
                  id="gender"
                  name="gender"
                  required
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full rounded-md border border-blue-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="birthDate"
                  className="block text-sm font-medium text-gray-700"
                >
                  Birth Date*
                </label>
                <input
                  type="date"
                  id="birthDate"
                  name="birthDate"
                  required
                  value={formData.birthDate}
                  onChange={handleChange}
                  className={`w-full rounded-md border ${
                    errors.birthDate ? "border-red-500" : "border-blue-200"
                  } px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                  max={new Date().toISOString().split("T")[0]}
                />
                {errors.birthDate && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.birthDate}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="civilStatus"
                  className="block text-sm font-medium text-gray-700"
                >
                  Civil Status*
                </label>
                <select
                  id="civilStatus"
                  name="civilStatus"
                  required
                  value={formData.civilStatus}
                  onChange={handleChange}
                  className="w-full rounded-md border border-blue-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                >
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Widowed">Widowed</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Separated">Separated</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 md:p-5 rounded-lg shadow-sm border border-blue-100">
            <div className="flex items-center mb-4">
              <Briefcase className="text-blue-600 mr-2" size={18} />
              <h3 className="text-md font-semibold text-blue-800">
                Employment Information
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="department"
                  className="block text-sm font-medium text-gray-700"
                >
                  Department*
                </label>
                <select
                  id="department"
                  name="department"
                  required
                  value={formData.department}
                  onChange={handleChange}
                  className={`w-full rounded-md border ${
                    errors.department ? "border-red-500" : "border-blue-200"
                  } px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept._id} value={dept.name}>
                      {dept.name}
                    </option>
                  ))}
                </select>
                {errors.department && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.department}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="position"
                  className="block text-sm font-medium text-gray-700"
                >
                  Position*
                </label>
                <select
                  id="position"
                  name="position"
                  required
                  value={formData.position}
                  onChange={handleChange}
                  className={`w-full rounded-md border ${
                    errors.position ? "border-red-500" : "border-blue-200"
                  } px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                >
                  <option value="">Select Position</option>
                  {positions.map((pos) => (
                    <option key={pos._id} value={pos.title}>
                      {pos.title}
                    </option>
                  ))}
                </select>
                {errors.position && (
                  <p className="text-sm text-red-600 mt-1">{errors.position}</p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="dateStarted"
                  className="block text-sm font-medium text-gray-700"
                >
                  Date Started*
                </label>
                <input
                  type="date"
                  id="dateStarted"
                  name="dateStarted"
                  required
                  value={formData.dateStarted}
                  onChange={handleChange}
                  className={`w-full rounded-md border ${
                    errors.dateStarted ? "border-red-500" : "border-blue-200"
                  } px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                  max={new Date().toISOString().split("T")[0]}
                />
                {errors.dateStarted && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.dateStarted}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="rate"
                  className="block text-sm font-medium text-gray-700"
                >
                  Rate (₱)*
                </label>
                <input
                  type="text"
                  id="rate"
                  name="rate"
                  required
                  value={formData.rate}
                  onChange={handleChange}
                  className={`w-full rounded-md border ${
                    errors.rate ? "border-red-500" : "border-blue-200"
                  } px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                  placeholder="Enter hourly rate"
                />
                {errors.rate && (
                  <p className="text-sm text-red-600 mt-1">{errors.rate}</p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700"
                >
                  Status*
                </label>
                <select
                  id="status"
                  name="status"
                  required
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full rounded-md border border-blue-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                >
                  <option value="Regular">Regular</option>
                  <option value="Irregular">Irregular</option>
                </select>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="remarks"
                  className="block text-sm font-medium text-gray-700"
                >
                  Remarks*
                </label>
                <select
                  id="remarks"
                  name="remarks"
                  required
                  value={formData.remarks}
                  onChange={handleChange}
                  className="w-full rounded-md border border-blue-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="On leave">On Leave</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 md:p-5 rounded-lg shadow-sm border border-blue-100">
            <div className="flex items-center mb-4">
              <CreditCard className="text-blue-600 mr-2" size={18} />
              <h3 className="text-md font-semibold text-blue-800">
                Government IDs
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="sss"
                  className="block text-sm font-medium text-gray-700"
                >
                  SSS Number
                </label>
                <input
                  type="text"
                  id="sss"
                  name="sss"
                  value={formData.sss}
                  onChange={handleChange}
                  className="w-full rounded-md border border-blue-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  placeholder="Enter SSS number"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="hdmf"
                  className="block text-sm font-medium text-gray-700"
                >
                  HDMF/PAGIBIG
                </label>
                <input
                  type="text"
                  id="hdmf"
                  name="hdmf"
                  value={formData.hdmf}
                  onChange={handleChange}
                  className="w-full rounded-md border border-blue-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  placeholder="Enter HDMF/PAGIBIG number"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="philhealth"
                  className="block text-sm font-medium text-gray-700"
                >
                  PhilHealth
                </label>
                <input
                  type="text"
                  id="philhealth"
                  name="philhealth"
                  value={formData.philhealth}
                  onChange={handleChange}
                  className="w-full rounded-md border border-blue-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  placeholder="Enter PhilHealth number"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="tin"
                  className="block text-sm font-medium text-gray-700"
                >
                  TIN Number
                </label>
                <input
                  type="text"
                  id="tin"
                  name="tin"
                  value={formData.tin}
                  onChange={handleChange}
                  className="w-full rounded-md border border-blue-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  placeholder="Enter TIN number"
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 md:p-5 rounded-lg shadow-sm border border-blue-100">
            <div className="flex items-center mb-4">
              <Phone className="text-blue-600 mr-2" size={18} />
              <h3 className="text-md font-semibold text-blue-800">
                Contact Information
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="emailAddress"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email Address*
                </label>
                <input
                  type="email"
                  id="emailAddress"
                  name="emailAddress"
                  required
                  value={formData.emailAddress}
                  onChange={handleChange}
                  className={`w-full rounded-md border ${
                    errors.emailAddress ? "border-red-500" : "border-blue-200"
                  } px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                  placeholder="Enter email address"
                />
                {errors.emailAddress && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.emailAddress}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="contactNumber"
                  className="block text-sm font-medium text-gray-700"
                >
                  Contact Number*
                </label>
                <div className="flex rounded-md">
                  <span className="inline-flex items-center px-3 py-2 text-sm text-gray-500 bg-gray-100 border border-r-0 border-blue-200 rounded-l-md">
                    +63
                  </span>
                  <input
                    type="text"
                    id="contactNumber"
                    name="contactNumber"
                    required
                    value={formData.contactNumber}
                    onChange={handleChange}
                    className={`w-full rounded-r-md border ${
                      errors.contactNumber
                        ? "border-red-500"
                        : "border-blue-200"
                    } px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                    placeholder="9XX XXX XXXX"
                  />
                </div>
                {errors.contactNumber && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.contactNumber}
                  </p>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <label
                  htmlFor="permanentAddress"
                  className="block text-sm font-medium text-gray-700"
                >
                  Permanent Address*
                </label>
                <input
                  type="text"
                  id="permanentAddress"
                  name="permanentAddress"
                  required
                  value={formData.permanentAddress}
                  onChange={handleChange}
                  className={`w-full rounded-md border ${
                    errors.permanentAddress
                      ? "border-red-500"
                      : "border-blue-200"
                  } px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                  placeholder="Enter permanent address"
                />
                {errors.permanentAddress && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.permanentAddress}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-4 md:mt-6">
            <button
              type="button"
              onClick={() => navigate("/Employees")}
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
              {isSubmitting ? "Saving..." : "Save Employee"}
            </button>
          </div>
        </form>
      </div>
      <Toaster position="bottom-left" richColors />
    </div>
  );
}
export default CreateEmployeeForm;
