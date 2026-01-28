import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert, KeyboardAvoidingView, Platform, Modal } from 'react-native'
import React, { useState } from 'react'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { updateTrip } from '@/lib/tripService'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { Calendar } from 'react-native-calendars'

const EditTrip = () => {
  const router = useRouter()
  const params = useLocalSearchParams()
  
  const [tripName] = useState(params.name?.toString() || "")
  const [budget, setBudget] = useState(params.budget as string)
  const [category, setCategory] = useState(params.category as string)
  const [notes, setNotes] = useState(params.notes as string)
  const [days, setDays] = useState(params.days as string)
  const [loading, setLoading] = useState(false)

  const [startDate, setStartDate] = useState(params.startDate as string || "")
  const [endDate, setEndDate] = useState(params.endDate as string || "")
  const [showCalendar, setShowCalendar] = useState(false)

  const categories = [
    { name: 'Adventure', icon: 'rocket', color: '#FF6B6B' },
    { name: 'Relax', icon: 'sunny', color: '#4ECDC4' },
    { name: 'Culture', icon: 'library', color: '#95E1D3' },
    { name: 'Food', icon: 'restaurant', color: '#FFE66D' },
    { name: 'Beach', icon: 'water', color: '#00B4D8' },
    { name: 'City', icon: 'business', color: '#A8DADC' }
  ]

  const onDayPress = (day: any) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(day.dateString)
      setEndDate("")
      setDays("1")
    } else if (day.dateString > startDate) {
      setEndDate(day.dateString)
      const start = new Date(startDate).getTime()
      const end = new Date(day.dateString).getTime()
      const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1
      setDays(diff.toString())
    } else {
      setStartDate(day.dateString)
    }
  }

  const handleUpdate = async () => {
    if (!params.id) {
    Alert.alert("Error", "Internal Trip ID not found. Please go back and try again.")
    return
    }

    if (!tripName.trim() || !startDate || !endDate) {
      Alert.alert("Error", "Please ensure all details and dates are filled.")
      return
    }
    setLoading(true)
    try {
      await updateTrip(params.id as string, {
        name: tripName,
        budget,
        category,
        days,
        notes,
        startDate, 
        endDate   
      })
      Alert.alert("Success", "Trip updated successfully!")
      router.replace({
        pathname: '/trip-details',
        params: { id: params.id, name: tripName, budget, category, days, notes, startDate, endDate }
      })
    } catch (e) {
      Alert.alert("Error", "Update failed.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      className="flex-1 bg-gray-50"
    >
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        
        {/* Header */}
        <LinearGradient colors={['#ffffff', '#f9fafb']} className="px-6 pt-14 pb-8">
          <View className="flex-row items-center justify-between mb-2">
            <View className="flex-1">
              <Text className="text-4xl font-black text-gray-900 mb-1">Edit Journey</Text>
              <Text className="text-gray-500 font-semibold">Update your plans</Text>
            </View>
            <TouchableOpacity onPress={() => router.back()} className="bg-gray-100 p-3 rounded-2xl">
              <Ionicons name="close" size={24} color="#374151" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <View className="px-6 mt-2">
          
          {/* Trip Dates Card */}
          <View className="bg-white rounded-3xl p-6 mb-6 shadow-md" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12 }}>
            <View className="flex-row items-center mb-4">
              <View className="bg-green-50 p-2 rounded-xl mr-3">
                <Ionicons name="calendar" size={20} color="#26cc00" />
              </View>
              <Text className="text-gray-400 font-bold uppercase text-xs tracking-widest">Schedule</Text>
            </View>

            <TouchableOpacity 
              onPress={() => setShowCalendar(true)}
              className="bg-gray-50 rounded-2xl p-4 flex-row justify-between items-center"
            >
              <View>
                <Text className="text-gray-400 text-[10px] font-black">START</Text>
                <Text className="font-bold text-gray-800">{startDate}</Text>
              </View>
              <Ionicons name="arrow-forward" size={16} color="#26cc00" />
              <View>
                <Text className="text-gray-400 text-[10px] font-black text-right">END</Text>
                <Text className="font-bold text-gray-800 text-right">{endDate || "Select"}</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View className="bg-white rounded-3xl p-6 mb-6 shadow-md" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12 }}>
            <View className="flex-row justify-between">
              <View className="flex-1 mr-2">
                <Text className="text-gray-500 font-bold text-xs mb-2">BUDGET ($)</Text>
                <TextInput 
                  value={budget} 
                  onChangeText={setBudget} 
                  keyboardType="numeric" 
                  className="bg-gray-50 p-4 rounded-2xl font-black text-gray-900 text-lg" 
                />
              </View>
              <View className="flex-1 ml-2">
                <Text className="text-gray-500 font-bold text-xs mb-2">DAYS</Text>
                <View className="bg-gray-100 p-4 rounded-2xl">
                  <Text className="font-black text-gray-400 text-lg">{days}</Text>
                </View>
              </View>
            </View>
          </View>

          <View className="bg-white rounded-3xl p-6 mb-6 shadow-md">
            <Text className="text-gray-800 font-bold text-lg mb-4">Trip Vibe</Text>
            <View className="flex-row flex-wrap justify-between">
              {categories.map((item) => (
                <TouchableOpacity
                  key={item.name}
                  onPress={() => setCategory(item.name)}
                  className={`w-[31%] p-3 items-center rounded-2xl mb-3 ${category === item.name ? 'bg-[#26cc00]' : 'bg-gray-50'}`}
                >
                  <Ionicons name={item.icon as any} size={22} color={category === item.name ? 'white' : item.color} />
                  <Text className={`text-[10px] font-black mt-1 ${category === item.name ? 'text-white' : 'text-gray-500'}`}>{item.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View className="bg-white rounded-3xl p-6 mb-6 shadow-md">
            <Text className="text-gray-800 font-bold text-lg mb-4">Travel Notes</Text>
            <TextInput 
              value={notes} 
              onChangeText={setNotes} 
              multiline 
              className="bg-gray-50 p-4 rounded-2xl text-gray-700 min-h-[120px]" 
              textAlignVertical="top"
            />
          </View>

          <View className="flex-row mb-10">
            <TouchableOpacity onPress={() => router.back()} className="flex-1 bg-white py-5 rounded-2xl mr-2 border-2 border-gray-200">
              <Text className="text-gray-600 text-center font-black">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleUpdate} disabled={loading} className="flex-1 bg-[#26cc00] py-5 rounded-2xl ml-2">
              <Text className="text-white text-center font-black">{loading ? "Updating..." : "Save Changes"}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Modal visible={showCalendar} animationType="fade" transparent={true}>
          <View className="flex-1 bg-black/60 justify-center px-4">
            <View className="bg-white rounded-[40px] p-6">
              <View className="flex-row justify-between mb-4">
                <Text className="text-xl font-black">Change Dates</Text>
                <TouchableOpacity onPress={() => setShowCalendar(false)}><Ionicons name="close" size={24} color="#000" /></TouchableOpacity>
              </View>
              <Calendar
                onDayPress={onDayPress}
                markedDates={{
                  [startDate]: { startingDay: true, color: '#26cc00', textColor: 'white', selected: true },
                  [endDate]: { endingDay: true, color: '#26cc00', textColor: 'white', selected: true }
                }}
                theme={{ todayTextColor: '#26cc00', arrowColor: '#26cc00' }}
              />
              <TouchableOpacity onPress={() => setShowCalendar(false)} className="bg-[#26cc00] py-4 rounded-2xl mt-6 items-center">
                <Text className="text-white font-black">Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default EditTrip