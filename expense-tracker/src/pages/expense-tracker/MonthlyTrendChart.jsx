import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const MonthlyTrendChart = ({ transactions }) => {
  // Group transactions by month (using createdAt field)
  // For each month, accumulate expenses and income separately.
  const monthlyData = transactions.reduce((acc, transaction) => {
    if (transaction.createdAt) {
      // Convert createdAt to a Date
      const date = transaction.createdAt.toDate
        ? transaction.createdAt.toDate()
        : new Date(transaction.createdAt);
      // Create a month label (e.g., "Jan 2023")
      const month = date.toLocaleString("default", {
        month: "short",
        year: "numeric",
      });
      if (!acc[month]) {
        acc[month] = { expense: 0, income: 0 };
      }
      if (transaction.transactionType === "expense") {
        acc[month].expense += Number(transaction.transactionAmount);
      } else if (transaction.transactionType === "income") {
        acc[month].income += Number(transaction.transactionAmount);
      }
    }
    return acc;
  }, {});

  // Get sorted month labels. (If your month strings are not chronologically sortable,
  // you may need a different sorting strategy.)
  const labels = Object.keys(monthlyData).sort(
    (a, b) => new Date(a) - new Date(b)
  );
  const expenseData = labels.map((label) => monthlyData[label].expense);
  const incomeData = labels.map((label) => monthlyData[label].income);

  const data = {
    labels,
    datasets: [
      {
        label: "Expenses",
        data: expenseData,
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        tension: 0.3,
      },
      {
        label: "Income",
        data: incomeData,
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Monthly Income vs Expense Trend" },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div>
      <Line data={data} options={options} />
    </div>
  );
};

export default MonthlyTrendChart;
