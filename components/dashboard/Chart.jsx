"use client";
import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { useExpensesData } from "../../lib/useExpensesData";

const Chart = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("This Week");
  const [currentViewDate, setCurrentViewDate] = useState(new Date());

  // Use real expenses data
  const {
    chartData,
    totalAmount,
    count,
    loading,
    error,
    isToday,
    periodLabel,
  } = useExpensesData(selectedPeriod, currentViewDate);

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
            ${payload[0].value.toFixed(2)}
          </p>
          <p className="text-sm text-gray-500">
            {payload[0].payload.count}{" "}
            {payload[0].payload.count === 1 ? "expense" : "expenses"}
          </p>
        </div>
      );
    }
    return null;
  };

  const periods = ["This Week", "This Month", "This Year"];

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading expenses data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-red-500 mb-2">
              <svg
                className="w-12 h-12 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <p className="text-gray-600 mb-2">Failed to load expenses data</p>
            <p className="text-sm text-gray-500">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Expenses Overview
          </h3>
          <div className="flex items-center space-x-4 mt-1">
            <p className="text-sm text-gray-600">
              <span className="font-medium text-gray-800">{periodLabel}</span>
            </p>
          </div>
        </div>

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

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#6B7280" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#6B7280" }}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#3B82F6"
              strokeWidth={2}
              fill="url(#colorValue)"
              dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: "#3B82F6", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Empty state */}
      {chartData.length === 0 && !loading && (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-gray-400 mb-2">
              <svg
                className="w-12 h-12 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <p className="text-gray-600 mb-1">No expenses data</p>
            <p className="text-sm text-gray-500">
              Add some expenses to see the chart
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chart;
