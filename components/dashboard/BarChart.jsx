"use client";
import { useState, useMemo } from "react";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const BarChart = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("This Month");
  const [currentViewDate, setCurrentViewDate] = useState(new Date());

  // Helper function to get date ranges and data based on period
  const getDateRangeAndData = useMemo(() => {
    const today = new Date();
    const viewDate = new Date(currentViewDate);

    const generateMockData = (count) => {
      return Array.from({ length: count }, (_, i) => ({
        value: Math.floor(Math.random() * 100 + 30),
      }));
    };

    switch (selectedPeriod) {
      case "Today": {
        const hours = Array.from({ length: 24 }, (_, i) => {
          const hour = new Date(viewDate);
          hour.setHours(i, 0, 0, 0);
          return hour;
        });
        return {
          dates: hours,
          data: generateMockData(24),
          formatLabel: (date) => date.getHours() + ":00",
          isToday: viewDate.toDateString() === today.toDateString(),
        };
      }

      case "This Week": {
        const startOfWeek = new Date(viewDate);
        const day = startOfWeek.getDay();
        startOfWeek.setDate(startOfWeek.getDate() - day);

        const weekDays = Array.from({ length: 7 }, (_, i) => {
          const date = new Date(startOfWeek);
          date.setDate(startOfWeek.getDate() + i);
          return date;
        });

        const currentWeekStart = new Date(today);
        currentWeekStart.setDate(today.getDate() - today.getDay());

        return {
          dates: weekDays,
          data: generateMockData(7),
          formatLabel: (date) => {
            const dayName = date.toLocaleDateString("en-US", {
              weekday: "short",
            });
            return dayName;
          },
          isToday:
            startOfWeek.toDateString() === currentWeekStart.toDateString(),
        };
      }

      case "This Month": {
        const startOfMonth = new Date(
          viewDate.getFullYear(),
          viewDate.getMonth(),
          1
        );
        const daysInMonth = new Date(
          viewDate.getFullYear(),
          viewDate.getMonth() + 1,
          0
        ).getDate();

        const monthDays = Array.from({ length: daysInMonth }, (_, i) => {
          const date = new Date(startOfMonth);
          date.setDate(i + 1);
          return date;
        });

        return {
          dates: monthDays,
          data: generateMockData(daysInMonth),
          formatLabel: (date) => {
            return date.getDate().toString();
          },
          isToday:
            viewDate.getMonth() === today.getMonth() &&
            viewDate.getFullYear() === today.getFullYear(),
        };
      }

      case "This Year": {
        const months = Array.from({ length: 12 }, (_, i) => {
          const date = new Date(viewDate.getFullYear(), i, 1);
          return date;
        });

        return {
          dates: months,
          data: generateMockData(12),
          formatLabel: (date) =>
            date.toLocaleDateString("en-US", { month: "short" }),
          isToday: viewDate.getFullYear() === today.getFullYear(),
        };
      }

      default:
        return { dates: [], data: [], formatLabel: () => "", isToday: false };
    }
  }, [selectedPeriod, currentViewDate]);

  const { dates, data, formatLabel, isToday } = getDateRangeAndData;

  // Prepare data for Recharts
  const chartData = useMemo(() => {
    return dates.map((date, index) => ({
      name: formatLabel(date),
      value: data[index]?.value || 0,
      fullDate: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    }));
  }, [dates, data, formatLabel]);

  const navigateTime = (direction) => {
    const newDate = new Date(currentViewDate);

    switch (selectedPeriod) {
      case "Today":
        newDate.setDate(newDate.getDate() + direction);
        break;
      case "This Week":
        newDate.setDate(newDate.getDate() + direction * 7);
        break;
      case "This Month":
        newDate.setMonth(newDate.getMonth() + direction);
        break;
      case "This Year":
        newDate.setFullYear(newDate.getFullYear() + direction);
        break;
    }

    setCurrentViewDate(newDate);
  };

  const goToToday = () => {
    setCurrentViewDate(new Date());
  };

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
          <p className="text-sm text-gray-600 mb-1">
            {payload[0].payload.fullDate}
          </p>
          <p className="text-lg font-semibold text-blue-600">
            {payload[0].value} Expenses
          </p>
        </div>
      );
    }
    return null;
  };

  const periods = ["This Week", "This Month", "This Year"];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Expenses Analytics</h3>

        <div className="flex items-center space-x-4">
          {/* Today Button */}
          <button
            onClick={goToToday}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              isToday
                ? "bg-green-100 text-green-700 border border-green-300"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Today
          </button>

          {/* Period Buttons */}
          <div className="flex space-x-2">
            {periods.map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  selectedPeriod === period
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {period}
              </button>
            ))}
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center space-x-1">
            <button
              onClick={() => navigateTime(-1)}
              className="p-1 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={() => navigateTime(1)}
              className="p-1 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Bar Chart Area with Recharts */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.9} />
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.7} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="name"
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="value"
              fill="url(#barGradient)"
              radius={[4, 4, 0, 0]}
              strokeWidth={0}
            />
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BarChart;
