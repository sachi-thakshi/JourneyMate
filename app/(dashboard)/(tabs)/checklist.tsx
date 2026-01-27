import { View, Text, TouchableOpacity, ScrollView, TextInput, FlatList } from 'react-native'
import React, { useState } from 'react'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

const Checklist = () => {
  const router = useRouter()
  const [newItem, setNewItem] = useState("")
  const [items, setItems] = useState([
    { id: '1', text: 'Passport & Visa', completed: false },
    { id: '2', text: 'Phone Charger', completed: true },
    { id: '3', text: 'Travel Insurance', completed: false }
  ])

  const addItem = () => {
    if (newItem.trim().length === 0) return
    const item = {
      id: Date.now().toString(),
      text: newItem,
      completed: false
    }
    setItems([item, ...items])
    setNewItem("")
  }

  const toggleItem = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ))
  }

  const deleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id))
  }

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="pt-16 px-6 pb-6 bg-white border-b border-gray-100">
        <View className="flex-row items-center">
          <TouchableOpacity 
            onPress={() => router.back()} 
            className="p-3 bg-gray-50 rounded-full"
          >
            <Ionicons name="chevron-back" size={24} color="black" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold ml-4">Packing List</Text>
        </View>
      </View>

      <View className="px-6 pt-6">
        {/* Input Area */}
        <View className="flex-row mb-6">
          <TextInput
            className="flex-1 bg-gray-50 p-4 rounded-2xl text-gray-800 border border-gray-100"
            placeholder="Add new item... (e.g. Sunscreen)"
            value={newItem}
            onChangeText={setNewItem}
          />
          <TouchableOpacity 
            onPress={addItem}
            style={{ backgroundColor: '#26cc00' }}
            className="ml-3 p-4 rounded-2xl justify-center items-center"
          >
            <Ionicons name="add" size={28} color="white" />
          </TouchableOpacity>
        </View>

        {/* List of Items */}
        <ScrollView 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={{ paddingBottom: 250 }}
        >
          {items.map((item) => (
            <View 
              key={item.id} 
              className="flex-row items-center justify-between bg-gray-50 p-4 rounded-2xl mb-3 border border-gray-100"
            >
              <TouchableOpacity 
                onPress={() => toggleItem(item.id)}
                className="flex-row items-center flex-1"
              >
                <Ionicons 
                  name={item.completed ? "checkbox" : "square-outline"} 
                  size={26} 
                  color={item.completed ? "#26cc00" : "#ccc"} 
                />
                <Text 
                  className={`ml-3 text-lg ${item.completed ? 'text-gray-400 line-through' : 'text-gray-800'}`}
                >
                  {item.text}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity onPress={() => deleteItem(item.id)}>
                <Ionicons name="trash-outline" size={20} color="#ff4444" />
              </TouchableOpacity>
            </View>
          ))}
          
          {items.length === 0 && (
            <View className="items-center mt-10">
              <Ionicons name="briefcase-outline" size={60} color="#eee" />
              <Text className="text-gray-400 mt-2">Your list is empty</Text>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  )
}

export default Checklist