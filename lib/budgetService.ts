import { addDoc, collection, serverTimestamp } from "firebase/firestore"
import { db } from "./firebase"
import { getAuth } from "firebase/auth"

const savingsCollection = collection(db, "savings")

export const addSavingRecord = async (amountLKR: number, note: string) => {
  const user = getAuth().currentUser
  if (!user) return

  await addDoc(savingsCollection, {
    amount: amountLKR,
    note: note || "Travel Savings",
    userId: user.uid,
    createdAt: serverTimestamp() 
  })
}