// src/hooks/useAddTransaction.js
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../config/firebase-config";
import { useGetUserInfo } from "./useGetUserInfo";

export const useAddTransaction = () => {
  const transactionCollectionRef = collection(db, "transactions");
  const { userID } = useGetUserInfo(); // Ensure this matches your user info hook

  const addTransaction = async ({
    description,
    transactionAmount,
    transactionType,
    category, // new field
  }) => {
    await addDoc(transactionCollectionRef, {
      userID,
      description,
      transactionAmount,
      transactionType,
      category, // store the category in Firestore
      createdAt: serverTimestamp(),
    });
  };

  return { addTransaction };
};
