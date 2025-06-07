import React, { useState, useEffect } from "react";
import { Calendar, CheckCircle } from "lucide-react";

function PayPeriodComponent({ payPeriod, setPayPeriod }) {
  const [payPeriods, setPayPeriods] = useState([]);
  const [lastGeneratedYear, setLastGeneratedYear] = useState(
    new Date().getFullYear()
  );
  const [isVisible, setIsVisible] = useState(false);

  function getPreviousPayPeriod(date) {
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();
    const day = date.getDate();

    if (day >= 1 && day <= 15) {
      const prevMonth = new Date(year, date.getMonth() - 1, 1);
      const prevMonthName = prevMonth.toLocaleString("default", {
        month: "long",
      });
      const prevYear = prevMonth.getFullYear();
      const lastDay = new Date(prevYear, prevMonth.getMonth() + 1, 0).getDate();
      return prevMonthName + " 16-" + lastDay + ", " + prevYear;
    } else {
      return month + " 1-15, " + year;
    }
  }

  function generatePayPeriods() {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const periods = [];

    for (let year = currentYear; year <= 2030; year++) {
      for (let month = 0; month < 12; month++) {
        const firstPeriod = new Date(year, month, 15);
        const firstPeriodString =
          firstPeriod.toLocaleString("default", { month: "long" }) +
          " 1-15, " +
          firstPeriod.getFullYear();
        periods.push(firstPeriodString);

        const secondPeriod = new Date(
          year,
          month,
          getLastDayOfMonth(new Date(year, month, 1))
        );
        const secondPeriodString =
          secondPeriod.toLocaleString("default", { month: "long" }) +
          " 16-" +
          secondPeriod.getDate() +
          ", " +
          secondPeriod.getFullYear();
        periods.push(secondPeriodString);
      }
    }

    periods.sort((a, b) => {
      function parseDate(periodString) {
        const [monthPart, datePart, yearPart] = periodString.split(" ");
        const monthIndex = new Date(
          Date.parse(monthPart + " 1, 2000")
        ).getMonth();
        const year = parseInt(yearPart);
        const isFirstHalf = datePart.includes("1-15");
        return new Date(year, monthIndex, isFirstHalf ? 1 : 16);
      }

      return parseDate(a).getTime() - parseDate(b).getTime();
    });

    setPayPeriods(periods);
    setLastGeneratedYear(2030);

    const previousPayPeriod = getPreviousPayPeriod(currentDate);
    setPayPeriod(previousPayPeriod);
  }

  function getLastDayOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  }

  useEffect(() => {
    generatePayPeriods();

    const updatePayPeriodInterval = setInterval(() => {
      const currentDate = new Date();
      const previousPayPeriod = getPreviousPayPeriod(currentDate);

      if (payPeriod !== previousPayPeriod) {
        setPayPeriod(previousPayPeriod);
      }
    }, 24 * 60 * 60 * 1000);

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => {
      clearTimeout(timer);
      clearInterval(updatePayPeriodInterval);
    };
  }, []);

  return (
    <div
      className="p-4 bg-blue-50 border-b border-blue-100 transition-all duration-500 ease-out"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(-10px)",
      }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <div className="flex items-center flex-wrap gap-2 sm:gap-3">
          <div className="flex items-center">
            <Calendar size={20} className="text-blue-800 mr-2" />
            <span className="text-gray-800 font-medium">Pay Period:</span>
          </div>
          <select
            className="bg-white text-gray-800 border border-blue-200 rounded-md px-2 sm:px-3 py-1.5 
            focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 
            w-full sm:w-auto text-sm sm:text-base"
            value={payPeriod}
            onChange={(e) => setPayPeriod(e.target.value)}
          >
            {payPeriods.map((period, index) => (
              <option key={index} value={period}>
                {period}
              </option>
            ))}
          </select>
        </div>
        <div
          className="text-emerald-600 flex items-center transition-all duration-500 ease-out"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateX(0)" : "translateX(10px)",
            transitionDelay: "200ms",
          }}
        >
          <CheckCircle size={16} className="mr-2" />
          <span className="text-sm sm:text-base">Payroll is ready to run</span>
        </div>
      </div>
    </div>
  );
}

export default PayPeriodComponent;
