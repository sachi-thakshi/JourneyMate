import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, updateDoc, where, onSnapshot } from "firebase/firestore"
import { db } from "./firebase"
import { getAuth } from "firebase/auth"

const auth = getAuth()
const checklistCollection = collection(db, "checklists")

export interface ChecklistItem {
  id: string
  task: string
  placeName: string
  description: string
  bestTime: string
  budgetLevel: string
  topActivities: string
  howToGo: string
  img: string
  completed: boolean
  userId: string
  createdAt: string
}

export const addToChecklist = async (place: any) => {
  const user = auth.currentUser
  if (!user) throw new Error("User not authenticated")

  await addDoc(checklistCollection, {
    task: `Explore ${place.name}`,
    placeName: place.name,
    description: place.description || "",
    bestTime: place.bestTime || "",
    budgetLevel: place.budgetLevel || "",
    topActivities: place.topActivities || "",
    howToGo: place.howToGo || "",
    img: place.img || "",
    completed: false,
    userId: user.uid,
    createdAt: new Date().toISOString()
  })
}

export const getChecklistItems = async (): Promise<ChecklistItem[]> => {
  const user = auth.currentUser
  if (!user) return []

  const q = query(
    checklistCollection,
    where("userId", "==", user.uid),
    orderBy("createdAt", "desc")
  )

  const snapshot = await getDocs(q)
  return snapshot.docs.map(document => ({
    id: document.id,
    ...document.data()
  } as ChecklistItem))
}

export const toggleItemStatus = async (itemId: string, currentStatus: boolean) => {
  try {
    const itemRef = doc(db, "checklists", itemId)
    await updateDoc(itemRef, {
      completed: !currentStatus
    })
  } catch (error) {
    console.error("Error updating status:", error)
    throw error
  }
}

export const deleteChecklistItem = async (itemId: string) => {
  try {
    const itemRef = doc(db, "checklists", itemId)
    await deleteDoc(itemRef)
  } catch (error) {
    console.error("Error deleting item:", error)
    throw error
  }
}