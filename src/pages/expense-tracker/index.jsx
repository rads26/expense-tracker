// src/pages/expense-tracker/index.jsx
import React, { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { useAddTransaction } from "../../hooks/useAddTransaction";
import { useGetTransactions } from "../../hooks/useGetTransactions";
import { useGetUserInfo } from "../../hooks/useGetUserInfo";
import { useUpdateTransaction } from "../../hooks/useUpdateTransaction";
import { useDeleteTransaction } from "../../hooks/useDeleteTransaction";
import { useNavigate } from "react-router-dom";
import { exportToCSV } from "../../utils/exportToCSV";
import MonthlyTrendChart from "./MonthlyTrendChart";
import RecurringTransactionsList from "./RecurringTransactionsList";
import "./styles.css";
import { auth } from "../../config/firebase-config";

const ExpenseTracker = () => {
  // Custom hooks for CRUD operations
  const { addTransaction } = useAddTransaction();
  const { transactions, transactionTotals } = useGetTransactions();
  const { userId, name, profilePhoto } = useGetUserInfo();
  const { updateTransaction } = useUpdateTransaction();
  const { deleteTransaction } = useDeleteTransaction();
  const navigate = useNavigate();

  // States for adding a new transaction
  const [description, setDescription] = useState("");
  const [transactionAmount, setTransactionAmount] = useState("");
  const [transactionType, setTransactionType] = useState("expense");
  // New state for category
  const [category, setCategory] = useState("");

  // States for monthly budget and transaction alert limit
  const [monthlyBudget, setMonthlyBudget] = useState("");
  const [alertLimit, setAlertLimit] = useState("");

  // Alert states for dropdown notifications
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [budgetAlert, setBudgetAlert] = useState("");
  const [showBudgetAlert, setShowBudgetAlert] = useState(false);

  // New state for search query
  const [searchQuery, setSearchQuery] = useState("");

  // States for editing a transaction, including category
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [editFormData, setEditFormData] = useState({
    description: "",
    transactionAmount: "",
    transactionType: "",
    category: "",
  });

  // Destructure totals
  const { balance, income, expenses } = transactionTotals;

  // Alert for monthly budget
  useEffect(() => {
    const budget = Number(monthlyBudget);
    if (budget > 0) {
      if (expenses >= budget) {
        setBudgetAlert("You have exceeded your monthly budget!");
        setShowBudgetAlert(true);
        setTimeout(() => setShowBudgetAlert(false), 5000);
      } else if (expenses >= budget * 0.8) {
        setBudgetAlert("You're nearing your monthly budget.");
        setShowBudgetAlert(true);
        setTimeout(() => setShowBudgetAlert(false), 5000);
      }
    }
  }, [expenses, monthlyBudget]);

  // Filter transactions based on search query (by description)
  const filteredTransactions = transactions.filter((transaction) =>
    transaction.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Aggregate expenses by category with fallback to "Uncategorized"
  const getCategoryTotals = (transactions) => {
    return transactions.reduce((acc, curr) => {
      // If category is missing or empty, use "Uncategorized"
      const categoryKey =
        curr.category && curr.category.trim() ? curr.category : "Uncategorized";
      // Only aggregate expenses
      if (curr.transactionType === "expense") {
        acc[categoryKey] = (acc[categoryKey] || 0) + Number(curr.transactionAmount);
      }
      return acc;
    }, {});
  };

  const categoryTotals = getCategoryTotals(transactions);

  // Handle new transaction submission with alert check
  const onSubmit = (e) => {
    e.preventDefault();
    const amount = Number(transactionAmount);
    const limit = Number(alertLimit);

    if (limit > 0 && transactionType === "expense" && amount > limit) {
      setAlertMessage(
        `Warning: Your transaction of $${amount} exceeds the allowed limit of $${limit}!`
      );
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 5000);
      return;
    }

    // Include the category in the transaction object
    addTransaction({
      description,
      transactionAmount: amount,
      transactionType,
      category,
    });
    // Reset fields
    setDescription("");
    setTransactionAmount("");
    setCategory("");
  };

  // Handle edit click; populate edit form with transaction details
  const handleEditClick = (transaction) => {
    setEditingTransaction(transaction);
    setEditFormData({
      description: transaction.description,
      transactionAmount: transaction.transactionAmount,
      transactionType: transaction.transactionType,
      category: transaction.category,
    });
  };

  // Handle update transaction submission
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    await updateTransaction(editingTransaction.id, {
      ...editFormData,
      transactionAmount: Number(editFormData.transactionAmount),
    });
    setEditingTransaction(null);
    setEditFormData({
      description: "",
      transactionAmount: "",
      transactionType: "",
      category: "",
    });
  };

  // Handle delete click
  const handleDeleteClick = async (id) => {
    await deleteTransaction(id);
  };

  // Sign out functionality
  const signUserOut = async () => {
    try {
      await signOut(auth);
      localStorage.clear();
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      {/* Alert Dropdown */}
      {showAlert && (
        <div className="alert-dropdown">
          <span>{alertMessage}</span>
          <button className="close-alert" onClick={() => setShowAlert(false)}>
            X
          </button>
        </div>
      )}
      {/* Monthly Budget Alert Dropdown */}
      {showBudgetAlert && (
        <div className="alert-dropdown" style={{ backgroundColor: "#ff5722" }}>
          <span>{budgetAlert}</span>
          <button className="close-alert" onClick={() => setShowBudgetAlert(false)}>
            X
          </button>
        </div>
      )}

      <div className="expense-tracker">
        <div className="container">
          <h1>{name}'s Expense Tracker</h1>
          <div className="balance">
            <h3>Your Balance</h3>
            {balance >= 0 ? <h2>${balance}</h2> : <h2>-${Math.abs(balance)}</h2>}
          </div>
          <div className="summary">
            <div className="income">
              <h4>Income</h4>
              <p>${income}</p>
            </div>
            <div className="expenses">
              <h4>Expenses</h4>
              <p>${expenses}</p>
            </div>
          </div>

          {/* Monthly Budget Input */}
          <div className="budget-alert-container">
  <div className="input-group">
    <label htmlFor="monthlyBudget">Set Monthly Budget: </label>
    <input
      type="number"
      id="monthlyBudget"
      value={monthlyBudget}
      onChange={(e) => setMonthlyBudget(e.target.value)}
      placeholder="Enter monthly budget"
    />
  </div>

  <div className="input-group">
    <label htmlFor="alertLimit">Set Transaction Alert Limit: </label>
    <input
      type="number"
      id="alertLimit"
      value={alertLimit}
      onChange={(e) => setAlertLimit(e.target.value)}
      placeholder="Enter alert limit"
    />
  </div>
</div>


          {/* Add Transaction Form */}
          <form className="add-transaction" onSubmit={onSubmit}>
            <input
              type="text"
              placeholder="Description"
              value={description}
              required
              onChange={(e) => setDescription(e.target.value)}
            />
            <input
              type="number"
              placeholder="Amount"
              value={transactionAmount}
              required
              onChange={(e) => setTransactionAmount(e.target.value)}
            />
            {/* Category Dropdown */}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="" disabled>
                Select category
              </option>
              <option value="Food">Food</option>
              <option value="Transportation">Transportation</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Bills">Bills</option>
              <option value="Health">Health</option>
              <option value="Other">Other</option>
            </select>
            <div>
              <input
                type="radio"
                id="expense"
                value="expense"
                checked={transactionType === "expense"}
                onChange={(e) => setTransactionType(e.target.value)}
              />
              <label htmlFor="expense">Expense</label>
              <input
                type="radio"
                id="income"
                value="income"
                checked={transactionType === "income"}
                onChange={(e) => setTransactionType(e.target.value)}
              />
              <label htmlFor="income">Income</label>
            </div>
            <button type="submit">Add Transaction</button>
          </form>
        </div>
        {profilePhoto && (
          <div className="profile">
            <img className="profile-photo" src={profilePhoto} alt="profile" />
            <button className="sign-out-button" onClick={signUserOut}>
              Sign Out
            </button>
          </div>
        )}
      </div>

      {/* Search Bar and Transactions List */}
      <div className="transactions">
        <h3>Transactions</h3>
        <input
          type="text"
          placeholder="Search by description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ marginBottom: "1rem", padding: "0.5rem", width: "100%" }}
        />
        <button onClick={() => exportToCSV(transactions)}>Export as CSV</button>
        <ul>
          {filteredTransactions.map((transaction) => (
            <li key={transaction.id}>
              <h4>{transaction.description}</h4>
              <p>
                ${transaction.transactionAmount} •{" "}
                <span
                  style={{
                    color:
                      transaction.transactionType === "expense" ? "red" : "green",
                  }}
                >
                  {transaction.transactionType}
                </span>{" "}
                •{" "}
                <strong>
                  {(transaction.category && transaction.category.trim()) ||
                    "Uncategorized"}
                </strong>
              </p>
              <button onClick={() => handleEditClick(transaction)}>Edit</button>
              <button onClick={() => handleDeleteClick(transaction.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Display Spending by Category */}
      <div className="category-totals">
        <h3>Spending by Category</h3>
        <ul>
          {Object.entries(categoryTotals).map(([cat, total]) => (
            <li key={cat}>
              <strong>{cat}:</strong> ${total.toFixed(2)}
            </li>
          ))}
        </ul>
      </div>

      {/* Monthly Trend Chart */}
      <div className="charts">
        <h3>Monthly Trend (Income vs Expense)</h3>
        <MonthlyTrendChart transactions={transactions} />
      </div>

      {/* Recurring Transactions Section */}
      <RecurringTransactionsList userId={userId} />

      {/* Edit Transaction Form */}
      {editingTransaction && (
        <div className="edit-transaction">
          <h3>Edit Transaction</h3>
          <form onSubmit={handleUpdateSubmit}>
            <input
              type="text"
              name="description"
              placeholder="Description"
              value={editFormData.description}
              onChange={(e) =>
                setEditFormData({ ...editFormData, description: e.target.value })
              }
              required
            />
            <input
              type="number"
              name="transactionAmount"
              placeholder="Amount"
              value={editFormData.transactionAmount}
              onChange={(e) =>
                setEditFormData({
                  ...editFormData,
                  transactionAmount: e.target.value,
                })
              }
              required
            />
            {/* Category Dropdown for Editing */}
            <select
              value={editFormData.category}
              onChange={(e) =>
                setEditFormData({ ...editFormData, category: e.target.value })
              }
              required
            >
              <option value="" disabled>
                Select category
              </option>
              <option value="Food">Food</option>
              <option value="Transportation">Transportation</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Bills">Bills</option>
              <option value="Health">Health</option>
              <option value="Other">Other</option>
            </select>
            <div>
              <input
                type="radio"
                id="edit-expense"
                name="transactionType"
                value="expense"
                checked={editFormData.transactionType === "expense"}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, transactionType: e.target.value })
                }
              />
              <label htmlFor="edit-expense">Expense</label>
              <input
                type="radio"
                id="edit-income"
                name="transactionType"
                value="income"
                checked={editFormData.transactionType === "income"}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, transactionType: e.target.value })
                }
              />
              <label htmlFor="edit-income">Income</label>
            </div>
            <button type="submit">Update Transaction</button>
            <button type="button" onClick={() => setEditingTransaction(null)}>
              Cancel
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default ExpenseTracker;
