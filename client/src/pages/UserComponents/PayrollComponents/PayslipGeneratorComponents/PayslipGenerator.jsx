import { useState } from "react";
import GenerateButton from "./GenerateButton";
import usePayslipGenerator from "./usePayslipGenerator";

function PayslipGenerator({ payrolls }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const { generateAllPayslips } = usePayslipGenerator(
    payrolls,
    setIsGenerating
  );

  return (
    <GenerateButton onClick={generateAllPayslips} isGenerating={isGenerating} />
  );
}

export default PayslipGenerator;
