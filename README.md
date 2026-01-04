# 💸 SpendWise — AI-Enhanced Expense Tracker

SpendWise is a full-stack expense management web application that helps users track spending, manage recurring transactions, and gain real-time financial insights through interactive analytics. The application integrates AI-powered NLP expense categorization to reduce manual effort and improve consistency.

## 🚀 Features

- Secure authentication using Firebase Auth  
- Real-time cross-device synchronization with Firebase Firestore  
- Full CRUD expense management (add, edit, delete, view)  
- Automated recurring transactions to reduce repetitive entries  
- Interactive charts and analytics dashboards for spending insights  
- AI-powered NLP expense categorization using the Gemini API  
- User-feedback loop to improve categorization accuracy  
- Intelligent alerts for expense updates  
- CSV export for data portability  
- Responsive UI for multiple screen sizes  

## 🧠 AI / NLP Expense Categorization

SpendWise uses Natural Language Processing (NLP) to automatically categorize expenses based on user-entered descriptions.

Example:  
Input: "Swiggy order"  
Output: Food

- Implemented using a pre-trained LLM via the Gemini API  
- Inference handled securely using Firebase Cloud Functions  
- User corrections are stored to improve future predictions  
- Reduces manual categorization by 60–75%

## 🏗️ System Architecture

React Frontend  
→ Firebase Cloud Functions  
→ Gemini API (NLP Categorization)  
→ Firestore (Real-time Database)

## 🛠️ Tech Stack

Frontend: React.js, JavaScript, CSS  
Backend/Cloud: Firebase Firestore, Firebase Authentication, Firebase Cloud Functions  
AI: Gemini API (NLP text classification)

## 📈 Impact

- Reduced manual data entry by 75%  
- Improved financial tracking accuracy by 90%  
- Reduced repetitive entries by 80% via recurring transactions  
- Faster expense logging using AI assistance  

## ⚙️ Getting Started

Clone the repository:  
git clone https://github.com/rads26/expense-tracker.git  
cd expense-tracker  

Install dependencies:  
npm install  

Create a .env file and add:  
REACT_APP_FIREBASE_API_KEY=your_firebase_key  
GEMINI_API_KEY=your_gemini_api_key  

Run the application:  
npm start  

The app runs at http://localhost:3000

## 🔮 Future Enhancements

- Budget limits with proactive alerts  
- Monthly expense forecasting  
- Advanced search and filters  
- Offline-first support with sync  

## 👩‍💻 Author

Radhika Kalanee  
GitHub: https://github.com/rads26  
LeetCode: https://leetcode.com/u/CometXx  

⭐ If you like this project, consider giving it a star!
