import { useState, useEffect, useMemo } from "react";
import { getUserExpenses } from "./expenseService";
import { useAuth } from "../context/AuthContext";

// Helper function to get formatted period label
const getPeriodLabel = (selectedPeriod, currentViewDate) => {
  const viewDate = new Date(currentViewDate);

  switch (selectedPeriod) {
    case "Today":
      return viewDate.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    case "This Week":
      const startOfWeek = new Date(viewDate);
      const day = startOfWeek.getDay();
      startOfWeek.setDate(startOfWeek.getDate() - day);

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(endOfWeek.getDate() + 6);

      return `${startOfWeek.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })} - ${endOfWeek.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })}`;
    case "This Month":
      return viewDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      });
    case "This Year":
      return viewDate.getFullYear().toString();
    default:
      return "";
  }
};

export const useExpensesData = (selectedPeriod, currentViewDate) => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Fetch expenses data
  useEffect(() => {
    const fetchExpenses = async () => {
      if (!user?.uid) return;

      setLoading(true);
      setError(null);

      try {
        const expensesData = await getUserExpenses(user.uid);
        setExpenses(expensesData);
      } catch (err) {
        console.error("Error fetching expenses:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [user?.uid]);

  // Process expenses data based on period and view date
  const processedData = useMemo(() => {
    if (!expenses.length)
      return {
        chartData: [],
        totalAmount: 0,
        count: 0,
        periodLabel: getPeriodLabel(selectedPeriod, currentViewDate),
      };

    const today = new Date();
    const viewDate = new Date(currentViewDate);

    const filterExpensesByDateRange = (startDate, endDate) => {
      return expenses.filter((expense) => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= startDate && expenseDate <= endDate;
      });
    };

    const aggregateExpensesByPeriod = (
      filteredExpenses,
      dates,
      formatLabel
    ) => {
      const dataMap = {};

      // Initialize all periods with 0
      dates.forEach((date) => {
        const label = formatLabel(date);
        dataMap[label] = { total: 0, count: 0, date };
      });

      // Aggregate expenses into the periods
      filteredExpenses.forEach((expense) => {
        const expenseDate = new Date(expense.date);
        const matchingDate = dates.find((date) => {
          switch (selectedPeriod) {
            case "Today":
              return date.getHours() === expenseDate.getHours();
            case "This Week":
              return date.toDateString() === expenseDate.toDateString();
            case "This Month":
              return date.getDate() === expenseDate.getDate();
            case "This Year":
              return date.getMonth() === expenseDate.getMonth();
            default:
              return false;
          }
        });

        if (matchingDate) {
          const label = formatLabel(matchingDate);
          dataMap[label].total += expense.total || 0;
          dataMap[label].count += 1;
        }
      });

      return Object.keys(dataMap).map((label) => ({
        name: label,
        value: dataMap[label].total,
        count: dataMap[label].count,
        fullDate: dataMap[label].date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
      }));
    };

    switch (selectedPeriod) {
      case "Today": {
        const startOfDay = new Date(viewDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(viewDate);
        endOfDay.setHours(23, 59, 59, 999);

        const hours = Array.from({ length: 24 }, (_, i) => {
          const hour = new Date(viewDate);
          hour.setHours(i, 0, 0, 0);
          return hour;
        });

        const filteredExpenses = filterExpensesByDateRange(
          startOfDay,
          endOfDay
        );
        const chartData = aggregateExpensesByPeriod(
          filteredExpenses,
          hours,
          (date) => date.getHours() + ":00"
        );

        return {
          chartData,
          totalAmount: filteredExpenses.reduce(
            (sum, exp) => sum + (exp.total || 0),
            0
          ),
          count: filteredExpenses.length,
          isToday: viewDate.toDateString() === today.toDateString(),
          periodLabel: getPeriodLabel(selectedPeriod, currentViewDate),
        };
      }

      case "This Week": {
        const startOfWeek = new Date(viewDate);
        const day = startOfWeek.getDay();
        startOfWeek.setDate(startOfWeek.getDate() - day);
        startOfWeek.setHours(0, 0, 0, 0);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(endOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);

        const weekDays = Array.from({ length: 7 }, (_, i) => {
          const date = new Date(startOfWeek);
          date.setDate(startOfWeek.getDate() + i);
          return date;
        });

        const filteredExpenses = filterExpensesByDateRange(
          startOfWeek,
          endOfWeek
        );
        const chartData = aggregateExpensesByPeriod(
          filteredExpenses,
          weekDays,
          (date) => date.toLocaleDateString("en-US", { weekday: "short" })
        );

        const currentWeekStart = new Date(today);
        currentWeekStart.setDate(today.getDate() - today.getDay());

        return {
          chartData,
          totalAmount: filteredExpenses.reduce(
            (sum, exp) => sum + (exp.total || 0),
            0
          ),
          count: filteredExpenses.length,
          isToday:
            startOfWeek.toDateString() === currentWeekStart.toDateString(),
          periodLabel: getPeriodLabel(selectedPeriod, currentViewDate),
        };
      }

      case "This Month": {
        const startOfMonth = new Date(
          viewDate.getFullYear(),
          viewDate.getMonth(),
          1
        );
        startOfMonth.setHours(0, 0, 0, 0);
        const endOfMonth = new Date(
          viewDate.getFullYear(),
          viewDate.getMonth() + 1,
          0
        );
        endOfMonth.setHours(23, 59, 59, 999);

        const daysInMonth = endOfMonth.getDate();
        const monthDays = Array.from({ length: daysInMonth }, (_, i) => {
          const date = new Date(startOfMonth);
          date.setDate(i + 1);
          return date;
        });

        const filteredExpenses = filterExpensesByDateRange(
          startOfMonth,
          endOfMonth
        );
        const chartData = aggregateExpensesByPeriod(
          filteredExpenses,
          monthDays,
          (date) => date.getDate().toString()
        );

        return {
          chartData,
          totalAmount: filteredExpenses.reduce(
            (sum, exp) => sum + (exp.total || 0),
            0
          ),
          count: filteredExpenses.length,
          isToday:
            viewDate.getMonth() === today.getMonth() &&
            viewDate.getFullYear() === today.getFullYear(),
          periodLabel: getPeriodLabel(selectedPeriod, currentViewDate),
        };
      }

      case "This Year": {
        const startOfYear = new Date(viewDate.getFullYear(), 0, 1);
        startOfYear.setHours(0, 0, 0, 0);
        const endOfYear = new Date(viewDate.getFullYear(), 11, 31);
        endOfYear.setHours(23, 59, 59, 999);

        const months = Array.from({ length: 12 }, (_, i) => {
          const date = new Date(viewDate.getFullYear(), i, 1);
          return date;
        });

        const filteredExpenses = filterExpensesByDateRange(
          startOfYear,
          endOfYear
        );
        const chartData = aggregateExpensesByPeriod(
          filteredExpenses,
          months,
          (date) => date.toLocaleDateString("en-US", { month: "short" })
        );

        return {
          chartData,
          totalAmount: filteredExpenses.reduce(
            (sum, exp) => sum + (exp.total || 0),
            0
          ),
          count: filteredExpenses.length,
          isToday: viewDate.getFullYear() === today.getFullYear(),
          periodLabel: getPeriodLabel(selectedPeriod, currentViewDate),
        };
      }

      default:
        return {
          chartData: [],
          totalAmount: 0,
          count: 0,
          isToday: false,
          periodLabel: getPeriodLabel(selectedPeriod, currentViewDate),
        };
    }
  }, [expenses, selectedPeriod, currentViewDate]);

  return {
    ...processedData,
    loading,
    error,
    periodLabel: getPeriodLabel(selectedPeriod, currentViewDate),
    refetch: () => {
      if (user?.uid) {
        setLoading(true);
        getUserExpenses(user.uid)
          .then(setExpenses)
          .catch(setError)
          .finally(() => setLoading(false));
      }
    },
  };
};
