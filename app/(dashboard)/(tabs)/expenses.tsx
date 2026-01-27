import { View, Text, TouchableOpacity, ScrollView, TextInput, FlatList } from 'react-native'
import React, { useState } from 'react'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

const Expenses = () => {
  const router = useRouter()
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")
  const [expenses, setExpenses] = useState([
    { id: '1', desc: 'Hotel Booking', price: 200 },
    { id: '2', desc: 'Train Ticket', price: 45 }
  ])

  const addExpense = () => {
    if (!description.trim() || !amount.trim()) return
    const newExpense = {
      id: Date.now().toString(),
      desc: description,
      price: parseFloat(amount)
    }
    setExpenses([newExpense, ...expenses])
    setDescription("")
    setAmount("")
  }

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter(item => item.id !== id))
  }

  const totalSpent = expenses.reduce((sum, item) => sum + item.price, 0)

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="pt-16 px-6 pb-6 bg-white border-b border-gray-100">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <TouchableOpacity 
              onPress={() => router.back()} 
              className="p-3 bg-gray-50 rounded-full"
            >
              <Ionicons name="chevron-back" size={24} color="black" />
            </TouchableOpacity>
            <Text className="text-2xl font-bold ml-4">Expense Tracker</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 150 }}>
        
        {/* Total Summary Card */}
        <View style={{ backgroundColor: '#26cc00' }} className="p-8 rounded-[35px] shadow-lg mb-8">
          <Text className="text-white/80 font-medium uppercase tracking-widest text-xs mb-1">Total Spent</Text>
          <Text className="text-white text-5xl font-extrabold">${totalSpent.toFixed(2)}</Text>
        </View>

        {/* Input Form */}
        <View className="bg-gray-50 p-6 rounded-3xl border border-gray-100 mb-8">
          <Text className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mb-4">Add New Expense</Text>
          
          <TextInput
            placeholder="Description (e.g. Dinner)"
            value={description}
            onChangeText={setDescription}
            className="bg-white p-4 rounded-2xl mb-3 border border-gray-100 text-gray-800"
          />
          
          <View className="flex-row">
            <TextInput
              placeholder="Amount ($)"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
              className="flex-1 bg-white p-4 rounded-2xl border border-gray-100 text-gray-800"
            />
            <TouchableOpacity 
              onPress={addExpense}
              style={{ backgroundColor: '#26cc00' }}
              className="ml-3 px-8 rounded-2xl justify-center items-center"
            >
              <Text className="text-white font-bold">Add</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Expense List */}
        <Text className="text-gray-800 text-xl font-bold mb-4">History</Text>
        {expenses.map((item) => (
          <View 
            key={item.id} 
            className="flex-row items-center justify-between bg-white p-5 rounded-2xl mb-3 border border-gray-100 shadow-sm"
          >
            <View className="flex-row items-center">
              <View className="bg-gray-100 p-3 rounded-xl mr-4">
                <Ionicons name="receipt-outline" size={20} color="#26cc00" />
              </View>
              <View>
                <Text className="text-gray-900 font-bold text-lg">{item.desc}</Text>
                <Text className="text-gray-400 text-sm">Today</Text>
              </View>
            </View>
            <View className="flex-row items-center">
              <Text className="text-gray-900 font-extrabold text-lg mr-4">-${item.price.toFixed(2)}</Text>
              <TouchableOpacity onPress={() => deleteExpense(item.id)}>
                <Ionicons name="close-circle" size={22} color="#ff4444" />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {expenses.length === 0 && (
          <View className="items-center py-10">
            <Text className="text-gray-300 italic">No expenses logged yet</Text>
          </View>
        )}
      </ScrollView>
    </View>
  )
}

export default Expenses