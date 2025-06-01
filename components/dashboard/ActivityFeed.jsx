"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { getRecentExpenses } from "@/lib/expenseService";

const ActivityFeed = () => {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecentExpenses = async () => {
      if (!user?.uid) return;

      try {
        setLoading(true);
        setError(null);
        const recentExpenses = await getRecentExpenses(user.uid, 4);
        setExpenses(recentExpenses);
      } catch (err) {
        console.error("Error fetching recent expenses:", err);
        setError("Failed to load recent expenses");
      } finally {
        setLoading(false);
      }
    };

    fetchRecentExpenses();
  }, [user]);

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays <= 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      "Food & Dining": "bg-orange-500",
      Transportation: "bg-blue-500",
      Shopping: "bg-purple-500",
      Entertainment: "bg-pink-500",
      Healthcare: "bg-red-500",
      "Bills & Utilities": "bg-yellow-500",
      Travel: "bg-green-500",
      Business: "bg-indigo-500",
      Education: "bg-teal-500",
      Other: "bg-gray-500",
    };
    return colors[category] || "bg-gray-500";
  };

  const getCategoryInitials = (category) => {
    if (!category) return "EX";
    return category
      .split(" ")
      .map((word) => word[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Recent Expenses
          </h3>
        </div>
        <div className="space-y-4">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="flex items-start space-x-3 animate-pulse"
            >
              <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0"></div>
              <div className="flex-1 min-w-0">
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Recent Expenses
          </h3>
        </div>
        <div className="text-center py-8">
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Recent Expenses</h3>
        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
          View All
        </button>
      </div>

      {expenses.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm">No expenses found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {expenses.map((expense) => (
            <div key={expense.id} className="flex items-start space-x-3">
              <div
                className={`w-8 h-8 ${getCategoryColor(
                  expense.category
                )} rounded-full flex items-center justify-center flex-shrink-0`}
              >
                <span className="text-white text-xs font-medium">
                  {getCategoryInitials(expense.category)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">
                      {expense.name || "Unnamed expense"}
                    </span>
                    {expense.merchant && (
                      <span className="text-gray-500">
                        {" "}
                        at {expense.merchant}
                      </span>
                    )}
                  </p>
                  <span className="text-sm font-medium text-gray-900">
                    {formatAmount(expense.total)}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {expense.category} • {formatDate(expense.date)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-gray-200">
        <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium">
          Load More Expenses
        </button>
      </div>
    </div>
  );
};

export default ActivityFeed;
