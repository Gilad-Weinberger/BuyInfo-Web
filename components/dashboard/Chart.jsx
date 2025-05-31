"use client";
import { useState } from "react";

const Chart = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("This Week");

  // Sample data points for the chart
  const dataPoints = [
    { x: 10, y: 80, value: "562K" },
    { x: 20, y: 60, value: "345K" },
    { x: 30, y: 45, value: "234K" },
    { x: 40, y: 30, value: "456K" },
    { x: 50, y: 40, value: "478K" },
    { x: 60, y: 25, value: "567K" },
  ];

  const periods = ["Today", "This Week", "This Month", "This Year"];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Revenue Overview
        </h3>
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
      </div>

      {/* Chart Area */}
      <div className="relative h-64 bg-gradient-to-br from-blue-50 to-pink-50 rounded-lg overflow-hidden">
        {/* Grid Lines */}
        <svg className="absolute inset-0 w-full h-full">
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="50%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
          </defs>

          {/* Background Area */}
          <path
            d={`M 0 ${240} L ${dataPoints
              .map((point, index) => `${index * 60 + 40} ${240 - point.y * 2}`)
              .join(" L ")} L ${dataPoints.length * 60} ${240} Z`}
            fill="url(#gradient1)"
            fillOpacity="0.3"
          />

          {/* Main Line */}
          <polyline
            points={dataPoints
              .map((point, index) => `${index * 60 + 40},${240 - point.y * 2}`)
              .join(" ")}
            fill="none"
            stroke="url(#gradient1)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Points */}
          {dataPoints.map((point, index) => (
            <g key={index}>
              <circle
                cx={index * 60 + 40}
                cy={240 - point.y * 2}
                r="6"
                fill="white"
                stroke="url(#gradient1)"
                strokeWidth="3"
              />

              {/* Value Labels */}
              <text
                x={index * 60 + 40}
                y={240 - point.y * 2 - 15}
                textAnchor="middle"
                className="text-xs font-medium fill-gray-700"
              >
                {point.value}
              </text>
            </g>
          ))}
        </svg>

        {/* Time Labels */}
        <div className="absolute bottom-2 left-0 right-0 flex justify-between px-10 text-xs text-gray-500">
          <span>Jan 15</span>
          <span>Jan 16</span>
          <span>Jan 17</span>
          <span>Jan 18</span>
          <span>Jan 19</span>
          <span>Jan 20</span>
          <span>Jan 21</span>
        </div>
      </div>
    </div>
  );
};

export default Chart;
