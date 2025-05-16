export function getStatusColor(status) {
  switch (status) {
    case "Pending":
      return "bg-yellow-100 text-yellow-800";
    case "Processed":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export function calculateDerivedValues(formData) {
  const totalRegularWage =
    (formData.numberOfRegularHours || 0) * (formData.hourlyRate || 0);

  const regularNightDifferential =
    (formData.regularNightDifferential || 0) * 8.06;

  const specialHoliday = (formData.specialHoliday || 0) * 104.81;

  const regularHoliday = (formData.regularHoliday || 0) * 161.25;

  const overtime = (formData.overtime || 0) * 100.78;

  const totalAmount =
    totalRegularWage +
    regularNightDifferential +
    (formData.prorated13thMonthPay || 0) +
    specialHoliday +
    regularHoliday +
    (formData.serviceIncentiveLeave || 0) +
    overtime;

  const netPay =
    totalAmount -
    (formData.hdmf || 0) -
    (formData.hdmfLoans || 0) -
    (formData.sss || 0) -
    (formData.phic || 0);

  return {
    totalRegularWage,
    totalAmount,
    netPay,
  };
}
