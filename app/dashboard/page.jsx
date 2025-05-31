"use client";
import React from "react";
import { useAuth } from "../../context/AuthContext";
import Sidebar from "../../components/layout/Sidebar";
import Header from "../../components/layout/Header";
import Chart from "../../components/dashboard/Chart";
import FamilySection from "../../components/dashboard/FamilySection";
import DataTable from "../../components/dashboard/DataTable";
import ActivityFeed from "../../components/dashboard/ActivityFeed";
import BarChart from "../../components/dashboard/BarChart";

const DashboardPage = () => {
  const { user, userData, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Access Denied
          </h2>
          <p className="text-gray-600">
            Please sign in to access the dashboard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header />

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Welcome Message */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome, {userData?.fullName || user.displayName || user.email}!
            </h1>
            <p className="text-gray-600">Here's your dashboard overview</p>
          </div>

          {/* Charts and Analytics Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Main Chart - Takes 2 columns */}
            <div className="lg:col-span-2">
              <Chart />
            </div>
            {/* Team Section */}
            <div>
              <FamilySection />
            </div>
          </div>

          {/* Second Analytics Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Activity Feed */}
            <div>
              <ActivityFeed />
            </div>
            {/* Bar Chart - Takes 2 columns */}
            <div className="lg:col-span-2">
              <BarChart />
            </div>
          </div>

          {/* Data Table */}
          <div className="mb-6">
            <DataTable />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
