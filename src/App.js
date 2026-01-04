import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ExpenseTracker from "./pages/expense-tracker/index"; // Default export
import { Auth } from "./pages/auth/index"; // Named export
import "./App.css";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/expense-tracker" element={<ExpenseTracker />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
