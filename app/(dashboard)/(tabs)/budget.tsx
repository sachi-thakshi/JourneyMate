import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Modal, FlatList } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { db } from '@/lib/firebase'
import { collection, query, where, onSnapshot, orderBy, limit } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { addSavingRecord } from '@/lib/budgetService'

const BudgetPage = () => {
  // Savings States
  const [inputAmount, setInputAmount] = useState('')
  const [note, setNote] = useState('')
  const [savingsHistory, setSavingsHistory] = useState<any[]>([])
  
  // Two-Way Sync Converter States
  const [fromAmount, setFromAmount] = useState('1')
  const [toAmount, setToAmount] = useState('')
  const [fromCurrency, setFromCurrency] = useState('LKR')
  const [toCurrency, setToCurrency] = useState('USD')
  
  const [exchangeRates, setExchangeRates] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [activePicker, setActivePicker] = useState<'from' | 'to' | 'history' | null>(null)

  const auth = getAuth()
  const user = auth.currentUser

  useEffect(() => {
    if (!user) return
    const q = query(
      collection(db, "savings"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    )
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setSavingsHistory(list)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    fetch(`https://open.er-api.com/v6/latest/${fromCurrency}`)
      .then(res => res.json())
      .then(data => {
        setExchangeRates(data.rates)
        const rate = data.rates[toCurrency]
        setToAmount((parseFloat(fromAmount) * rate).toFixed(2))
      })
      .catch(() => Alert.alert("Error", "Check Connection"))
  }, [fromCurrency])

  const syncFromTo = (value: string) => {
    setFromAmount(value)
    const rate = exchangeRates[toCurrency]
    if (rate) setToAmount(((parseFloat(value) || 0) * rate).toFixed(2))
  }

  const syncToFrom = (value: string) => {
    setToAmount(value)
    const rate = exchangeRates[toCurrency]
    if (rate) setFromAmount(((parseFloat(value) || 0) / rate).toFixed(2))
  }

  const handleAddSavings = async () => {
    if (!inputAmount) return
    try {
      await addSavingRecord(parseFloat(inputAmount), note)
      setInputAmount(''); setNote('')
      Alert.alert("Success", "Deposit Recorded!")
    } catch (e) { Alert.alert("Error", "Failed") }
  }

  const recentDeposit = savingsHistory[0]?.amount || 0

  return (
    <View className="flex-1 bg-[#f2fdf6]">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <LinearGradient 
          colors={['#26cc00', '#1b9400']} 
          className="px-6 pt-16 pb-14 rounded-b-[50px] shadow-xl"
        >
          <View className="mb-6">
            <Text className="text-white text-5xl font-black">Budget Tracker</Text>
            <View className="h-1 w-12 bg-white/30 rounded-full mt-1" />
          </View>

          <Text className="text-yellow-300 font-black uppercase text-[10px] tracking-[2px] mb-1">
            Most Recent Deposit
          </Text>
          <Text className="text-white text-4xl font-black">
            Rs. {recentDeposit.toLocaleString()}
          </Text>  
        </LinearGradient> 

        <View className="px-6 -mt-8">
          <View className="bg-gray-900 p-6 rounded-[35px] shadow-2xl mb-8">
            <Text className="text-[#26cc00] font-black text-[10px] uppercase mb-4 tracking-widest">Live Currency Converter</Text>
            
            <View className="flex-row items-center bg-white/10 rounded-2xl p-4 mb-2">
              <TextInput
                value={fromAmount}
                onChangeText={syncFromTo}
                keyboardType="numeric"
                className="flex-1 text-white text-2xl font-black"
                placeholderTextColor="#666"
              />
              <TouchableOpacity onPress={() => setActivePicker('from')} className="bg-[#26cc00] px-3 py-2 rounded-xl flex-row items-center">
                <Text className="text-white font-bold mr-1">{fromCurrency}</Text>
                <Ionicons name="chevron-down" size={12} color="white" />
              </TouchableOpacity>
            </View>

            <View className="items-center -my-3 z-10">
               <View className="bg-white rounded-full p-1"><Ionicons name="swap-vertical" size={20} color="#1a1a1a" /></View>
            </View>

            <View className="flex-row items-center bg-white/10 rounded-2xl p-4 mt-2">
              <TextInput
                value={toAmount}
                onChangeText={syncToFrom}
                keyboardType="numeric"
                className="flex-1 text-white text-2xl font-black"
                placeholderTextColor="#666"
              />
              <TouchableOpacity onPress={() => setActivePicker('to')} className="bg-gray-700 px-3 py-2 rounded-xl flex-row items-center">
                <Text className="text-white font-bold mr-1">{toCurrency}</Text>
                <Ionicons name="chevron-down" size={12} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          {/* ADD TRAVEL MONEY (LKR) */}
          <View className="bg-white p-6 rounded-[35px] shadow-lg border border-green-50 mb-8">
            <Text className="text-gray-400 font-black text-[10px] uppercase tracking-widest mb-4">Add Travel Money (LKR)</Text>
            <TextInput
              placeholder="Amount Rs."
              value={inputAmount}
              onChangeText={setInputAmount}
              keyboardType="numeric"
              className="text-3xl font-black text-gray-900 border-b-2 border-green-100 pb-3 mb-4"
            />
            <TextInput
              placeholder="Note (Income, Bonus...)"
              value={note}
              onChangeText={setNote}
              className="bg-gray-50 p-4 rounded-2xl text-gray-700 font-semibold mb-5"
            />
            <TouchableOpacity onPress={handleAddSavings} className="bg-[#26cc00] py-4 rounded-2xl items-center shadow-md shadow-green-200">
              <Text className="text-white font-black text-lg">Deposit LKR</Text>
            </TouchableOpacity>
          </View>

          {/* HISTORY LOG */}
          <Text className="text-xl font-black text-gray-900 mb-4 px-2">Savings History</Text>
          {savingsHistory.map((item) => (
            <View key={item.id} className="bg-white p-5 rounded-[25px] mb-4 flex-row items-center justify-between border border-gray-50">
              <View className="flex-row items-center">
                <View className="bg-green-50 p-3 rounded-xl mr-4"><Ionicons name="wallet-outline" size={20} color="#26cc00" /></View>
                <View>
                  <Text className="text-gray-900 font-black">Rs. {item.amount.toLocaleString()}</Text>
                  <Text className="text-gray-400 text-xs">{item.note || 'Travel Money'}</Text>
                </View>
              </View>
              <Text className="text-gray-300 text-[10px] font-bold">{item.createdAt?.toDate().toLocaleDateString() || "Today"}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Shared Currency Picker Modal */}
      <Modal visible={activePicker !== null} animationType="fade" transparent={true}>
        <View className="flex-1 bg-black/60 justify-center px-8">
          <View className="bg-white rounded-[40px] h-[70%] p-6">
            <View className="flex-row justify-between mb-4">
               <Text className="text-xl font-black">Select Currency</Text>
               <TouchableOpacity onPress={() => setActivePicker(null)}><Ionicons name="close-circle" size={24} color="#ddd" /></TouchableOpacity>
            </View>
            <FlatList
              data={Object.keys(exchangeRates)}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  onPress={() => {
                    if (activePicker === 'from') setFromCurrency(item);
                    else setToCurrency(item);
                    setActivePicker(null);
                  }}
                  className="py-4 border-b border-gray-50 flex-row justify-between"
                >
                  <Text className={`font-bold ${item === (activePicker === 'from' ? fromCurrency : toCurrency) ? 'text-[#26cc00]' : 'text-gray-700'}`}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default BudgetPage