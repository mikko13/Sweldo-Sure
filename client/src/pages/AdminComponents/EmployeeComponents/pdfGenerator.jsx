import jsPDF from "jspdf";
import { format } from "date-fns";

export function generateEmployeePDF(employee) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  doc.setFillColor(240, 246, 255);
  doc.rect(0, 0, 210, 297, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(33, 83, 140);
  doc.text("Employee Profile", 105, 25, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);

  const startY = 50;
  const leftColumn = 20;
  const rightColumn = 110;
  const lineHeight = 10;

  doc.setFont("helvetica", "bold");
  doc.text("Personal Information", leftColumn, startY);
  doc.setFont("helvetica", "normal");

  const personalDetails = [
    {
      label: "Full Name",
      value: employee.lastName + "," + employee.firstName + employee.middleName,
    },
    {
      label: "Birth Date",
      value: format(new Date(employee.birthDate), "MMM dd, yyyy"),
    },
    { label: "Gender", value: employee.gender },
    { label: "Civil Status", value: employee.civilStatus },
  ];

  personalDetails.forEach((detail, index) => {
    doc.text(detail.label, leftColumn, startY + (index + 1) * lineHeight);
    doc.text(detail.value, rightColumn, startY + (index + 1) * lineHeight, {
      align: "left",
    });
  });

  const professionalStartY = startY + (personalDetails.length + 1) * lineHeight;
  doc.setFont("helvetica", "bold");
  doc.text("Professional Information", leftColumn, professionalStartY);
  doc.setFont("helvetica", "normal");

  const professionalDetails = [
    { label: "Position", value: employee.position },
    { label: "Department", value: employee.department },
    {
      label: "Date Started",
      value: format(new Date(employee.dateStarted), "MMM dd, yyyy"),
    },
    { label: "Status", value: employee.status },
    { label: "Remarks", value: employee.remarks || "N/A" },
  ];

  professionalDetails.forEach((detail, index) => {
    doc.text(
      detail.label,
      leftColumn,
      professionalStartY + (index + 1) * lineHeight
    );
    doc.text(
      detail.value,
      rightColumn,
      professionalStartY + (index + 1) * lineHeight,
      { align: "left" }
    );
  });

  const contactStartY =
    professionalStartY + (professionalDetails.length + 1) * lineHeight;
  doc.setFont("helvetica", "bold");
  doc.text("Contact & Identification", leftColumn, contactStartY);
  doc.setFont("helvetica", "normal");

  const contactDetails = [
    { label: "Email", value: employee.emailAddress },
    { label: "Contact Number", value: employee.contactNumber },
    { label: "Permanent Address", value: employee.permanentAddress },
    { label: "SSS Number", value: employee.sss },
    { label: "TIN Number", value: employee.tin },
    { label: "PhilHealth", value: employee.philhealth },
    { label: "HDMF/Pag-IBIG", value: employee.hdmf },
  ];

  contactDetails.forEach((detail, index) => {
    doc.text(
      detail.label,
      leftColumn,
      contactStartY + (index + 1) * lineHeight
    );
    doc.text(
      detail.value,
      rightColumn,
      contactStartY + (index + 1) * lineHeight,
      { align: "left" }
    );
  });

  doc.setDrawColor(200);
  doc.line(20, 280, 190, 280);
  doc.setFont("helvetica", "italic");
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text("Generated on: " + format(new Date(), "MMM dd, yyyy"), 105, 290, {
    align: "center",
  });

  doc.save(employee.lastName + "_" + employee.firstName + "_Profile.pdf");
}
