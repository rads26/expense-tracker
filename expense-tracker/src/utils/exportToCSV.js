// src/utils/exportToCSV.js
export const exportToCSV = (transactions) => {
    const header = ["Description", "Amount", "Type", "Category", "Date"];
    const rows = transactions.map((tx) => [
      tx.description,
      tx.transactionAmount,
      tx.transactionType,
      tx.category,
      new Date(tx.createdAt.seconds * 1000).toLocaleDateString(),
    ]);
    
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [header, ...rows].map((e) => e.join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "transactions.csv");
    document.body.appendChild(link);
    
    link.click();
    document.body.removeChild(link);
  };
  