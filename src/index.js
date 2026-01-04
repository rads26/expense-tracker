import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import ExpenseTracker from './pages/expense-tracker/index';

ReactDOM.render(
  <BrowserRouter>
    <ExpenseTracker />
  </BrowserRouter>,
  document.getElementById('root')
);
