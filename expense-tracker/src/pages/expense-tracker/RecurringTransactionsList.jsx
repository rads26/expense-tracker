// src/pages/expense-tracker/RecurringTransactionsList.jsx
import React, { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../../config/firebase-config";

const RecurringTransactionsList = ({ userId }) => {
  const [recurringTransactions, setRecurringTransactions] = useState([]);

  useEffect(() => {
    // Only run the query if userId is defined
    if (!userId) return;
    
    const q = query(
      collection(db, "recurringTransactions"),
      where("userId", "==", userId)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const transactions = [];
      querySnapshot.forEach((doc) => {
        transactions.push({ id: doc.id, ...doc.data() });
      });
      setRecurringTransactions(transactions);
    });

    return () => unsubscribe();
  }, [userId]);

  return (
    <div className="recurring-transactions">
      <h3>Your Recurring Transactions</h3>
      {recurringTransactions.length > 0 ? (
        <ul>
          {recurringTransactions.map((transaction) => (
            <li key={transaction.id}>
              <strong>{transaction.description}</strong>: ${transaction.amount}{" "}
              ({transaction.transactionType}) every {transaction.frequency} <br />
              Next Due:{" "}
              {new Date(transaction.nextDue.seconds * 1000).toLocaleDateString()}
            </li>
          ))}
        </ul>
      ) : (
        <p>No recurring transactions found.</p>
      )}
    </div>
  );
};

export default RecurringTransactionsList;
