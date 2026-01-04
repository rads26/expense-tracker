import { doc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase-config";

export const useUpdateTransaction = () => {
  const updateTransaction = async (transactionId, updatedData) => {
    const transactionDocRef = doc(db, "transactions", transactionId);
    // updatedData can now include the 'category' field along with others.
    await updateDoc(transactionDocRef, updatedData);
  };

  return { updateTransaction };
};
