import { addDoc, collection, deleteDoc, doc, onSnapshot, query, where, orderBy } from "firebase/firestore"
import { db } from "./firebase"
import { getAuth } from "firebase/auth"

const auth = getAuth()
const expenseCollection = collection(db, "expenses")

export interface ExpenseItem {
  id: string
  title: string
  amount: number
  category: string
  tripId: string
  createdAt: string
}

export const addExpense = async (tripId: string, title: string, amount: number, category: string) => {
  const user = auth.currentUser
  if (!user) throw new Error("User not authenticated")

  await addDoc(expenseCollection, {
    tripId,
    title,
    amount,
    category,
    userId: user.uid,
    createdAt: new Date().toISOString()
  })
}

export const deleteExpense = async (expenseId: string) => {
  await deleteDoc(doc(db, "expenses", expenseId))
}