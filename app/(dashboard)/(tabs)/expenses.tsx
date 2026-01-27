import { View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { db } from '@/lib/firebase'
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { addExpense, deleteExpense, ExpenseItem } from '@/lib/expenseService'
import { LinearGradient } from 'expo-linear-gradient'

const Expenses = () => {
  const router = useRouter()
  const { id, name, budget } = useLocalSearchParams() // Received from TripDetails
  
  const [title, setTitle] = useState("")
  const [amount, setAmount] = useState("")
  const [expenses, setExpenses] = useState<ExpenseItem[]>([])
  const [loading, setLoading] = useState(true)

  const tripBudget = parseFloat(budget as string) || 0

  useEffect(() => {
    const user = getAuth().currentUser
    if (!user || !id) return

    const q = query(
      collection(db, "expenses"),
      where("tripId", "==", id),
      orderBy("createdAt", "desc")
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as ExpenseItem[]
      setExpenses(list)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [id])

  const totalSpent = expenses.reduce((sum, item) => sum + item.amount, 0)
  const remaining = tripBudget - totalSpent

  const handleAddExpense = async () => {
    const numericAmount = parseFloat(amount)
    
    if (!title.trim()) {
      Alert.alert("Error", "Please enter a title")
      return
    }
    
    if (isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert("Error", "Please enter a valid amount")
      return
    }

    try {
      await addExpense(id as string, title, numericAmount, "General")
      setTitle("")
      setAmount("")
    } catch (error) {
      console.error("Full Firebase Error:", error) // This will show the real reason in your terminal
      Alert.alert("Error", "Could not save expense")
    }
  }

  return (
    <View className="flex-1 bg-[#f2fdf6]">
      <LinearGradient colors={['#26cc00', '#1b9400']} className="px-6 pt-16 pb-12 rounded-b-[40px]">
        <TouchableOpacity onPress={() => router.back()} className="mb-4">
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
        <Text className="text-3xl font-black text-white">{name}</Text>
        <Text className="text-white/80 font-bold uppercase tracking-widest text-xs">Expense Tracker</Text>
      </LinearGradient>

      {/* Summary Cards */}
      <View className="flex-row px-6 -mt-8 justify-between">
        <View className="bg-white p-5 rounded-3xl w-[48%] shadow-lg shadow-green-900/20">
          <Text className="text-gray-400 font-bold text-[10px] uppercase">Total Spent</Text>
          <Text className="text-2xl font-black text-gray-900">${totalSpent.toFixed(2)}</Text>
        </View>
        <View className="bg-white p-5 rounded-3xl w-[48%] shadow-lg shadow-green-900/20">
          <Text className="text-gray-400 font-bold text-[10px] uppercase">Remaining</Text>
          <Text className={`text-2xl font-black ${remaining < 0 ? 'text-red-500' : 'text-[#26cc00]'}`}>
            ${remaining.toFixed(2)}
          </Text>
        </View>
      </View>

      <View className="px-6 mt-8">
        <View className="bg-white p-4 rounded-3xl shadow-sm border border-green-50 flex-row items-center mb-6">
          <TextInput 
            placeholder="Item (e.g. Coffee)" 
            value={title} 
            onChangeText={setTitle} 
            className="flex-1 font-bold text-gray-700 px-2"
          />
          <TextInput 
            placeholder="$0.00" 
            value={amount} 
            onChangeText={setAmount} 
            keyboardType="numeric"
            className="w-20 font-black text-[#26cc00] px-2 text-right"
          />
          <TouchableOpacity onPress={handleAddExpense} className="bg-[#26cc00] p-3 rounded-2xl ml-2">
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <FlatList
          data={expenses}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View className="bg-white p-5 rounded-3xl mb-4 flex-row items-center justify-between shadow-sm border border-gray-50">
              <View className="flex-row items-center">
                <View className="bg-green-50 p-3 rounded-2xl mr-4">
                  <Ionicons name="cart" size={20} color="#26cc00" />
                </View>
                <View>
                  <Text className="text-gray-900 font-black text-base">{item.title}</Text>
                  <Text className="text-gray-400 text-xs">{new Date(item.createdAt).toLocaleDateString()}</Text>
                </View>
              </View>
              <View className="items-end">
                <Text className="text-gray-900 font-black text-base">${item.amount.toFixed(2)}</Text>
                <TouchableOpacity onPress={() => deleteExpense(item.id)}>
                  <Text className="text-red-400 text-[10px] font-bold mt-1 uppercase">Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>
    </View>
  )
}

export default Expenses