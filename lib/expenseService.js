import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  doc,
  deleteDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

const COLLECTION_NAME = "expenses";

// Add a new expense
export const addExpense = async (userId, expenseData) => {
  try {
    const expense = {
      ...expenseData,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, COLLECTION_NAME), expense);

    return {
      id: docRef.id,
      ...expense,
      createdAt: new Date().toISOString(), // For immediate UI update
      updatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error adding expense:", error);
    throw new Error("Failed to add expense");
  }
};

// Get all expenses for a user
export const getUserExpenses = async (userId) => {
  try {
    // First, try the optimized query with orderBy
    let q = query(
      collection(db, COLLECTION_NAME),
      where("userId", "==", userId)
    );

    const querySnapshot = await getDocs(q);
    const expenses = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      expenses.push({
        id: doc.id,
        ...data,
        // Convert Firestore timestamps to ISO strings
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt,
        date: data.date || new Date().toISOString(),
      });
    });

    // Sort the results client-side by date (newest first)
    expenses.sort((a, b) => new Date(b.date) - new Date(a.date));

    return expenses;
  } catch (error) {
    console.error("Error fetching expenses:", error);

    // Provide more detailed error information
    if (error.code === "failed-precondition") {
      throw new Error("Database index required. Please contact support.");
    } else if (error.code === "permission-denied") {
      throw new Error("Permission denied. Please sign in again.");
    } else if (error.code === "unavailable") {
      throw new Error("Database temporarily unavailable. Please try again.");
    } else {
      throw new Error(`Failed to fetch expenses: ${error.message}`);
    }
  }
};

// Update an expense
export const updateExpense = async (expenseId, updatedData) => {
  try {
    const expenseRef = doc(db, COLLECTION_NAME, expenseId);
    const updatePayload = {
      ...updatedData,
      updatedAt: serverTimestamp(),
    };

    await updateDoc(expenseRef, updatePayload);

    return {
      id: expenseId,
      ...updatedData,
      updatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error updating expense:", error);
    throw new Error("Failed to update expense");
  }
};

// Delete an expense
export const deleteExpense = async (expenseId) => {
  try {
    const expenseRef = doc(db, COLLECTION_NAME, expenseId);
    await deleteDoc(expenseRef);
    return expenseId;
  } catch (error) {
    console.error("Error deleting expense:", error);
    throw new Error("Failed to delete expense");
  }
};

// Get expenses by date range (simplified to avoid index issues)
export const getExpensesByDateRange = async (userId, startDate, endDate) => {
  try {
    // Get all user expenses first, then filter client-side
    const allExpenses = await getUserExpenses(userId);

    const filteredExpenses = allExpenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return expenseDate >= start && expenseDate <= end;
    });

    return filteredExpenses;
  } catch (error) {
    console.error("Error fetching expenses by date range:", error);
    throw new Error("Failed to fetch expenses by date range");
  }
};

// Get total expenses for a user
export const getTotalExpenses = async (userId) => {
  try {
    const expenses = await getUserExpenses(userId);
    return expenses.reduce((total, expense) => total + (expense.total || 0), 0);
  } catch (error) {
    console.error("Error calculating total expenses:", error);
    throw new Error("Failed to calculate total expenses");
  }
};

// Get recent expenses for a user (last 4)
export const getRecentExpenses = async (userId, limit = 4) => {
  try {
    const allExpenses = await getUserExpenses(userId);

    // Return the first 4 expenses (already sorted by date newest first)
    return allExpenses.slice(0, limit);
  } catch (error) {
    console.error("Error fetching recent expenses:", error);
    throw new Error("Failed to fetch recent expenses");
  }
};
