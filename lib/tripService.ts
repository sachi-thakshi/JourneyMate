import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, updateDoc, where } from "firebase/firestore"
import { db } from "./firebase"
import { getAuth } from "firebase/auth"

const auth = getAuth()
const tripsCollection = collection(db, "trips") 

export const addTrip = async (
    name: string,
    budget: string,
    category: string,
    days: string,
    notes: string
) => {
    const user = auth.currentUser
    if (!user) return

    await addDoc(tripsCollection, {
        name,
        budget,
        category,
        days,
        notes,
        userId: user.uid,
        createdAt: new Date().toISOString()
    }) 
} 

export const getAllTrips = async () => {
    const user = auth.currentUser
    if (!user) return []

    const q = query(
        tripsCollection, 
        where("userId", "==", user.uid), 
        orderBy("createdAt", "desc")
    )

    const snapshot = await getDocs(q)
    return snapshot.docs.map(document => {
        const data = document.data()
        return {
            id: document.id,
            name: data.name as string,
            budget: data.budget as string,
            category: data.category as string,
            days: data.days as string,
            notes: data.notes as string,
            createdAt: data.createdAt as string
        }
    })
}

export const deleteTrip = async (tripId: string) => {
  try {
    const tripRef = doc(db, "trips", tripId)
    await deleteDoc(tripRef)
  } catch (error) {
    console.error("Error deleting trip:", error)
    throw error
  }
}

export const updateTrip = async (tripId: string, updatedData: any) => {
  try {
    const tripRef = doc(db, "trips", tripId)
    await updateDoc(tripRef, updatedData)
  } catch (error) {
    console.error("Error updating trip:", error)
    throw error
  }
}