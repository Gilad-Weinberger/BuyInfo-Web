"use client";
import { useState } from "react";

const DataTable = () => {
  const [filter, setFilter] = useState("All");

  const tableData = [
    {
      id: 1,
      name: "Premium Package",
      status: "active",
      value: "599",
      change: "+12%",
      priority: "high",
    },
    {
      id: 2,
      name: "Basic Plan",
      status: "pending",
      value: "299",
      change: "+8%",
      priority: "medium",
    },
    {
      id: 3,
      name: "Enterprise",
      status: "active",
      value: "999",
      change: "+15%",
      priority: "high",
    },
    {
      id: 4,
      name: "Starter",
      status: "inactive",
      value: "99",
      change: "-2%",
      priority: "low",
    },
    {
      id: 5,
      name: "Professional",
      status: "active",
      value: "799",
      change: "+5%",
      priority: "medium",
    },
    {
      id: 6,
      name: "Team Plan",
      status: "pending",
      value: "449",
      change: "+3%",
      priority: "medium",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "text-red-600";
      case "medium":
        return "text-yellow-600";
      case "low":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Latest Activity</h3>
        <div className="flex space-x-2">
          {["All", "Active", "Pending", "Inactive"].map((filterOption) => (
            <button
              key={filterOption}
              onClick={() => setFilter(filterOption)}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                filter === filterOption
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {filterOption}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-2 font-medium text-gray-600">
                Package
              </th>
              <th className="text-left py-3 px-2 font-medium text-gray-600">
                Status
              </th>
              <th className="text-left py-3 px-2 font-medium text-gray-600">
                Value
              </th>
              <th className="text-left py-3 px-2 font-medium text-gray-600">
                Change
              </th>
              <th className="text-left py-3 px-2 font-medium text-gray-600">
                Priority
              </th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row) => (
              <tr
                key={row.id}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="py-3 px-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-sm font-medium">
                        {row.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <span className="font-medium text-gray-900">
                      {row.name}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      row.status
                    )}`}
                  >
                    {row.status}
                  </span>
                </td>
                <td className="py-3 px-2 font-medium text-gray-900">
                  ${row.value}
                </td>
                <td className="py-3 px-2">
                  <span
                    className={`font-medium ${
                      row.change.startsWith("+")
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {row.change}
                  </span>
                </td>
                <td className="py-3 px-2">
                  <span
                    className={`font-medium ${getPriorityColor(row.priority)}`}
                  >
                    ●
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
        <span>Showing 1-6 of 471</span>
        <div className="flex space-x-2">
          <button className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50">
            Previous
          </button>
          <button className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
