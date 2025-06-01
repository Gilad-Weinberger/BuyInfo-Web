"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getUserExpenses } from "../../lib/expenseService";
import ExpenseForm from "../../components/receipts/ExpenseForm";
import ExpenseList from "../../components/receipts/ExpenseList";

const ReceiptsPage = () => {
  const { user, loading } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [isLoadingExpenses, setIsLoadingExpenses] = useState(false);
  const [error, setError] = useState(null);

  // Load expenses from Firebase when user is available
  useEffect(() => {
    const loadExpenses = async () => {
      if (!user) {
        setExpenses([]);
        return;
      }

      console.log("Loading expenses for user:", user.uid); // Debug log
      setIsLoadingExpenses(true);
      setError(null);

      try {
        const userExpenses = await getUserExpenses(user.uid);
        console.log("Loaded expenses:", userExpenses); // Debug log
        setExpenses(userExpenses);
      } catch (error) {
        console.error("Error loading expenses:", error);
        setError(error.message || "Failed to load expenses. Please try again.");
      } finally {
        setIsLoadingExpenses(false);
      }
    };

    loadExpenses();
  }, [user]);

  const handleExpenseAdded = (newExpense) => {
    console.log("New expense added:", newExpense); // Debug log
    setExpenses((prev) => [newExpense, ...prev]);
  };

  const handleRetryLoad = () => {
    if (user) {
      setError(null);
      const loadExpenses = async () => {
        setIsLoadingExpenses(true);
        try {
          const userExpenses = await getUserExpenses(user.uid);
          setExpenses(userExpenses);
        } catch (error) {
          console.error("Retry error loading expenses:", error);
          setError(
            error.message || "Failed to load expenses. Please try again."
          );
        } finally {
          setIsLoadingExpenses(false);
        }
      };
      loadExpenses();
    }
  };

  // Show loading state while authentication is being checked
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg
            className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show sign-in prompt if user is not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <svg
              className="w-24 h-24 text-gray-300 mx-auto mb-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Access Restricted
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Please sign in to access your receipts and expenses
            </p>
            <a
              href="/auth/signin"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white text-lg font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                />
              </svg>
              Sign In
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Receipts & Expenses
              </h1>
              <p className="mt-2 text-gray-600">
                Track and manage your expenses with detailed receipts
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Welcome back,</p>
              <p className="text-lg font-semibold text-gray-900">
                {user.displayName || user.email}
              </p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-red-400 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-red-700">{error}</p>
              </div>
              <button
                onClick={handleRetryLoad}
                className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors text-sm"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Expense Form */}
        <div className="mb-8">
          <ExpenseForm onExpenseAdded={handleExpenseAdded} />
        </div>

        {/* Loading State for Expenses */}
        {isLoadingExpenses ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="text-center">
              <svg
                className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <p className="text-gray-600">Loading your expenses...</p>
            </div>
          </div>
        ) : (
          /* Expense List */
          <div>
            <ExpenseList expenses={expenses} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ReceiptsPage;
