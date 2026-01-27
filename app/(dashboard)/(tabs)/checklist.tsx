import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert, Image, Modal, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { db } from '@/lib/firebase'
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { toggleItemStatus, deleteChecklistItem, ChecklistItem } from '@/lib/checklistService'
import { LinearGradient } from 'expo-linear-gradient'

const Checklist = () => {
  const [items, setItems] = useState<ChecklistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedItem, setSelectedItem] = useState<ChecklistItem | null>(null) 
  const auth = getAuth()

  useEffect(() => {
    const user = auth.currentUser
    if (!user) return

    const q = query(
      collection(db, "checklists"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ChecklistItem[]
      setItems(list)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const handleToggle = async (id: string, currentStatus: boolean) => {
    try {
      await toggleItemStatus(id, currentStatus)
    } catch (error) {
      Alert.alert("Error", "Could not update status")
    }
  }

  const handleDelete = (id: string) => {
    Alert.alert("Delete Item", "Are you sure you want to remove this journey?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => deleteChecklistItem(id) }
    ])
  }

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-[#f2fdf6]">
        <ActivityIndicator size="large" color="#26cc00" />
      </View>
    )
  }

  return (
    <View className="flex-1 bg-[#f2fdf6]">
      {/* Header */}
      <LinearGradient colors={['#ffffff', '#ecfdf3']} className="px-6 pt-16 pb-6">
        <Text className="text-4xl font-black text-[#14532d]">My List</Text>
        <Text className="text-[#16a34a] font-semibold text-base">Your saved travel guides</Text>
      </LinearGradient>

      {items.length === 0 ? (
        <View className="flex-1 justify-center items-center px-10">
          <Ionicons name="document-text-outline" size={80} color="#d1d5db" />
          <Text className="text-gray-400 text-center mt-4 font-bold">No items yet. Go to Explore and add some destinations!</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
          renderItem={({ item }) => (
            <View 
              className={`bg-white rounded-[30px] mb-6 p-5 shadow-sm border ${item.completed ? 'border-gray-100 opacity-60' : 'border-green-50'}`}
              style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10 }}
            >
              {/* Top Row: Checkbox, Name, and Delete */}
              <View className="flex-row items-start justify-between mb-4">
                <View className="flex-row items-center flex-1">
                  <TouchableOpacity onPress={() => handleToggle(item.id, item.completed)}>
                    <Ionicons 
                      name={item.completed ? "checkmark-circle" : "ellipse-outline"} 
                      size={32} 
                      color={item.completed ? "#26cc00" : "#d1d5db"} 
                    />
                  </TouchableOpacity>
                  <View className="ml-3 flex-1">
                    <Text className={`text-xl font-black ${item.completed ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                      {item.placeName}
                    </Text>
                    <View className="flex-row items-center mt-0.5">
                      <Ionicons name="time-outline" size={12} color="#16a34a" />
                      <Text className="text-[#16a34a] text-[10px] font-black uppercase tracking-widest ml-1">
                        {typeof item.bestTime === 'object' ? 'Summer' : item.bestTime || 'Year-round'}
                      </Text>
                    </View>
                  </View>
                </View>
                <TouchableOpacity onPress={() => handleDelete(item.id)} className="p-2">
                  <Ionicons name="trash-outline" size={20} color="#ff4444" />
                </TouchableOpacity>
              </View>

              {/* Task Snippet */}
              <View className="bg-gray-50 rounded-2xl p-4 border border-gray-100 mb-5">
                <Text className="text-gray-600 leading-5 text-sm italic text-center" numberOfLines={2}>
                  {item.task}
                </Text>
              </View>

              {/* View Details Button - Centered at the bottom */}
              <TouchableOpacity 
                onPress={() => setSelectedItem(item)}
                className="bg-[#26cc00] py-3.5 rounded-2xl shadow-sm items-center justify-center flex-row"
                style={{ shadowColor: '#26cc00', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 5 }}
              >
                <Ionicons name="eye-outline" size={18} color="white" />
                <Text className="text-white font-black text-sm ml-2">View Guide Details</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      {/* Detail View Modal */}
      <Modal visible={!!selectedItem} animationType="slide" transparent={true}>
        <View className="flex-1 bg-black/60 justify-end">
          <View className="bg-white rounded-t-[50px] h-[85%]">
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Image Section */}
              <View className="h-64 w-full relative">
                <Image source={{ uri: selectedItem?.img }} className="w-full h-full" resizeMode="cover" />
                <TouchableOpacity 
                  onPress={() => setSelectedItem(null)}
                  className="absolute top-6 right-6 bg-white/20 backdrop-blur-md p-3 rounded-2xl"
                >
                  <Ionicons name="close" size={24} color="white" />
                </TouchableOpacity>
              </View>

              <View className="px-8 pt-8 pb-10">
                <Text className="text-3xl font-black text-gray-900 mb-2">{selectedItem?.placeName}</Text>
                <View className="flex-row items-center mb-6">
                  <Ionicons name="location" size={16} color="#26cc00" />
                  <Text className="text-gray-400 font-bold ml-1">Saved Journey</Text>
                </View>

                {/* Info Blocks */}
                <View className="bg-green-50 rounded-3xl p-6 mb-6">
                  <Text className="text-[#26cc00] font-black text-xs uppercase tracking-widest mb-2">The Guide</Text>
                  <Text className="text-gray-700 leading-6 text-base">{selectedItem?.description}</Text>
                </View>

                <View className="bg-gray-900 rounded-3xl p-6 mb-6">
                  <Text className="text-[#26cc00] font-black text-xs uppercase tracking-widest mb-2">Must Do</Text>
                  <Text className="text-white/80 leading-6 font-medium italic">{selectedItem?.topActivities}</Text>
                </View>

                {selectedItem?.howToGo && (
                  <View className="bg-orange-50 rounded-3xl p-6 mb-8 border border-orange-100">
                    <Text className="text-orange-600 font-black text-xs uppercase tracking-widest mb-2">Travel Tip</Text>
                    <Text className="text-orange-800 leading-6">{selectedItem.howToGo}</Text>
                  </View>
                )}

                <TouchableOpacity 
                  onPress={() => setSelectedItem(null)}
                  className="bg-gray-100 py-5 rounded-3xl items-center"
                >
                  <Text className="text-gray-600 font-black">Close Guide</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default Checklist