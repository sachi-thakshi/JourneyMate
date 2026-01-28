import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert, KeyboardAvoidingView, Platform, ActivityIndicator, Modal } from 'react-native'
import React, { useState } from 'react'
import { useRouter, useRootNavigationState } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { addTrip } from '@/lib/tripService'
import { Calendar } from 'react-native-calendars'

const CreateTrip = () => {
  const router = useRouter()
  const rootNavigationState = useRootNavigationState()
  
  const [tripName, setTripName] = useState("")
  const [budget, setBudget] = useState("")
  const [category, setCategory] = useState("Adventure")
  const [notes, setNotes] = useState("")
  const [days, setDays] = useState("1")
  const [loading, setLoading] = useState(false)

  const [suggestions, setSuggestions] = useState<any[]>([])
  const [searching, setSearching] = useState(false)

  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [showCalendar, setShowCalendar] = useState(false)

  const categories = [
    { name: 'Adventure', icon: 'rocket', color: '#FF6B6B' },
    { name: 'Relax', icon: 'sunny', color: '#4ECDC4' },
    { name: 'Culture', icon: 'library', color: '#95E1D3' },
    { name: 'Food', icon: 'restaurant', color: '#FFE66D' },
    { name: 'Beach', icon: 'water', color: '#00B4D8' },
    { name: 'City', icon: 'business', color: '#A8DADC' }
  ]

  const searchPlaces = async (text: string) => {
    setTripName(text)
    if (text.length > 2) {
      setSearching(true)
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(text)}&limit=5`,
          { headers: { 'User-Agent': 'JourneyMateApp/1.0', 'Accept-Language': 'en' } }
        )
        const data = await response.json()
        setSuggestions(data)
      } catch (error) {
        setSuggestions([])
      } finally {
        setSearching(false)
      }
    } else {
      setSuggestions([])
    }
  }

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

  const handleCreate = async () => {
    if (!tripName.trim() || !startDate || !endDate) {
      Alert.alert("Error", "Please fill in all details.")
      return
    }

    setLoading(true)
    try {
      const docRef = await addTrip(tripName, budget, category, days, notes, startDate, endDate)
      
      if (!docRef) {
        throw new Error("Failed to create document")
      }

      const newId = docRef.id

      const tripData = { 
        id: newId, 
        name: tripName, 
        budget, 
        category, 
        notes, 
        days, 
        startDate, 
        endDate 
      }

      setTripName("")
      setBudget("")
      setCategory("Adventure")
      setNotes("")
      setDays("1")
      setStartDate("")
      setEndDate("")
      setSuggestions([])
      setSearching(false)

      setTimeout(() => {
        router.push({
          pathname: '/trip-details',
          params: tripData
        })
      }, 150)

    } catch (error) {
      console.error(error)
      Alert.alert("Error", "Could not save your trip.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 bg-gray-50">
      <LinearGradient colors={['#26cc00', '#22b800']} className="pt-16 px-6 pb-6 shadow-lg">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="p-3 bg-white/20 rounded-full">
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <View className="ml-4">
            <Text className="text-white text-2xl font-black">Plan Your Trip</Text>
            <Text className="text-white/80 text-sm font-bold">New Adventure Awaits</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        
        {/* Destination Section */}
        <View className="mx-6 mt-6 z-50">
          <View className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <View className="flex-row items-center mb-3">
              <View className="bg-[#26cc00] p-2 rounded-xl"><Ionicons name="location" size={20} color="white" /></View>
              <Text className="text-gray-800 font-black text-lg ml-3">Destination</Text>
            </View>
            <View className="flex-row items-center bg-gray-50 rounded-2xl px-4 py-4 mt-2">
              <Ionicons name="map-outline" size={24} color="#26cc00" />
              <TextInput
                placeholder="Where to? (e.g., Paris, Colombo)"
                value={tripName}
                onChangeText={searchPlaces}
                className="flex-1 ml-3 text-base font-bold text-gray-800"
                placeholderTextColor="#9ca3af"
              />
              {searching && <ActivityIndicator size="small" color="#26cc00" />}
            </View>
            {suggestions.length > 0 && (
              <View className="bg-white border border-gray-100 rounded-2xl mt-2 shadow-xl">
                {suggestions.map((item, index) => (
                  <TouchableOpacity 
                    key={index} 
                    onPress={() => { setTripName(item.display_name); setSuggestions([]); }}
                    className="p-4 border-b border-gray-50 flex-row items-center"
                  >
                    <Ionicons name="pin" size={16} color="#26cc00" />
                    <Text className="ml-3 text-gray-700 text-xs flex-1" numberOfLines={1}>{item.display_name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* Date Section */}
        <View className="mx-6 mt-6">
          <TouchableOpacity onPress={() => setShowCalendar(true)} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <View className="flex-row items-center mb-3">
              <View className="bg-[#26cc00] p-2 rounded-xl"><Ionicons name="calendar" size={20} color="white" /></View>
              <Text className="text-gray-800 font-black text-lg ml-3">Trip Dates</Text>
            </View>
            <View className="flex-row justify-between items-center bg-gray-50 rounded-2xl p-4">
              <View><Text className="text-gray-400 text-[10px] font-black uppercase">Departure</Text><Text className="font-bold">{startDate || "Set Date"}</Text></View>
              <Ionicons name="airplane" size={18} color="#26cc00" />
              <View><Text className="text-gray-400 text-[10px] font-black uppercase text-right">Return</Text><Text className="font-bold text-right">{endDate || "Set Date"}</Text></View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Budget Section */}
        <View className="mx-6 mt-6">
          <View className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
             <View className="flex-row items-center mb-3">
              <View className="bg-[#26cc00] p-2 rounded-xl"><Ionicons name="cash" size={20} color="white" /></View>
              <Text className="text-gray-800 font-black text-lg ml-3">Budget & Days</Text>
            </View>
            <View className="flex-row justify-between">
              <View className="w-[48%] bg-gray-50 p-4 rounded-2xl">
                <Text className="text-gray-400 text-[10px] font-black uppercase mb-1">Budget ($)</Text>
                <TextInput value={budget} onChangeText={setBudget} keyboardType="numeric" placeholder="0" className="text-xl font-black text-gray-800" />
              </View>
              <View className="w-[48%] bg-gray-50 p-4 rounded-2xl">
                <Text className="text-gray-400 text-[10px] font-black uppercase mb-1">Total Days</Text>
                <Text className="text-xl font-black text-gray-800">{days} Days</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Categories Section */}
        <View className="mx-6 mt-6">
          <View className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <Text className="text-gray-800 font-black text-lg mb-4">Trip Vibe</Text>
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
        </View>

        {/* Notes Section */}
        <View className="mx-6 mt-6">
          <View className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <Text className="text-gray-800 font-black text-lg mb-4">Travel Notes</Text>
            <TextInput
              placeholder="Must visit restaurants, landmarks..."
              multiline value={notes} onChangeText={setNotes}
              className="bg-gray-50 p-4 rounded-2xl text-gray-800 min-h-[100px]"
              textAlignVertical="top"
            />
          </View>
        </View>
      </ScrollView>

      {/* Main Action Button */}
      <View className="px-6 pb-12 pt-4 bg-gray-50">
        <TouchableOpacity disabled={loading} onPress={handleCreate} className="rounded-3xl overflow-hidden shadow-xl">
          <LinearGradient colors={loading ? ['#cccccc', '#aaaaaa'] : ['#26cc00', '#22b800']} className="py-5 flex-row justify-center items-center">
            <Ionicons name={loading ? "sync" : "airplane"} size={24} color="white" />
            <Text className="text-white text-xl font-black ml-3">{loading ? "Saving Trip..." : "Start Journey"}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Calendar Overlay */}
      <Modal visible={showCalendar} animationType="slide" transparent={true}>
        <View className="flex-1 bg-black/60 justify-center px-4">
          <View className="bg-white rounded-[40px] p-6">
            <View className="flex-row justify-between mb-4">
              <Text className="text-xl font-black">Select Dates</Text>
              <TouchableOpacity onPress={() => setShowCalendar(false)}>
                <Ionicons name="close-circle" size={28} color="#ddd" />
              </TouchableOpacity>
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
              <Text className="text-white font-black">Confirm Schedule</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  )
}

export default CreateTrip