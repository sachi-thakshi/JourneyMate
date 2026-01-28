import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert, KeyboardAvoidingView, Platform, ActivityIndicator, FlatList } from 'react-native'
import React, { useState } from 'react'
import { useRouter, useRootNavigationState } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { addTrip } from '@/lib/tripService'

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

  const selectLocation = (locationName: string) => {
    setTripName(locationName)
    setSuggestions([])
  }

  const handleCreate = async () => {
    if (!tripName.trim()) {
      Alert.alert("Error", "Please enter a destination")
      return
    }
    if (!rootNavigationState?.key) return

    setLoading(true)
    try {
      await addTrip(tripName, budget, category, days, notes)
      setTimeout(() => {
        router.push({
          pathname: '/trip-details',
          params: { name: tripName, budget, category, notes, days }
        })
      }, 150)
      setTripName(""); setBudget(""); setCategory("Adventure"); setNotes(""); setDays("1")
    } catch (error) {
      Alert.alert("Error", "Could not save your trip.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 bg-gray-50">
      <LinearGradient
        colors={['#26cc00', '#22b800']}
        className="pt-16 px-6 pb-6 shadow-lg"
      >
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="p-3 bg-white/20 rounded-full">
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <View className="ml-4">
            <Text className="text-white text-2xl font-black">Plan Your Trip</Text>
            <Text className="text-white/80 text-sm font-bold">Where to next?</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Destination Card */}
        <View className="mx-6 mt-6 z-50">
          <View className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <View className="flex-row items-center mb-3">
              <View className="bg-[#26cc00] p-2 rounded-xl">
                <Ionicons name="location" size={20} color="white" />
              </View>
              <Text className="text-gray-800 font-black text-lg ml-3">Destination</Text>
            </View>
            
            <View className="flex-row items-center bg-gray-50 rounded-2xl px-4 py-4 mt-2">
              <Ionicons name="map-outline" size={24} color="#26cc00" />
              <TextInput
                placeholder="Where to? (e.g., Paris, Bali)"
                value={tripName}
                onChangeText={searchPlaces}
                className="flex-1 ml-3 text-base font-bold text-gray-800"
                placeholderTextColor="#9ca3af"
              />
              {searching && <ActivityIndicator size="small" color="#26cc00" />}
            </View>

            {/* Suggestions Dropdown */}
            {suggestions.length > 0 && (
              <View className="bg-white border border-gray-100 rounded-2xl mt-2 shadow-xl">
                {suggestions.map((item, index) => (
                  <TouchableOpacity 
                    key={index} 
                    onPress={() => selectLocation(item.display_name)}
                    className={`p-4 flex-row items-center border-b border-gray-50 ${index === suggestions.length - 1 ? 'border-b-0' : ''}`}
                  >
                    <Ionicons name="pin" size={16} color="#26cc00" />
                    <Text className="ml-3 text-gray-700 text-sm flex-1" numberOfLines={1}>{item.display_name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* Budget & Duration Card */}
        <View className="mx-6 mt-6">
          <View className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <View className="flex-row items-center mb-4">
              <View className="bg-[#26cc00] p-2 rounded-xl">
                <Ionicons name="cash" size={20} color="white" />
              </View>
              <Text className="text-gray-800 font-black text-lg ml-3">Trip Details</Text>
            </View>

            <View className="flex-row justify-between">
              <View className="w-[48%]">
                <Text className="text-gray-400 font-black text-[10px] uppercase mb-2">Budget</Text>
                <View className="bg-gray-50 rounded-2xl px-4 py-4 flex-row items-center">
                  <Text className="text-[#26cc00] text-lg font-black">$</Text>
                  <TextInput
                    placeholder="0"
                    keyboardType="numeric"
                    value={budget}
                    onChangeText={setBudget}
                    className="flex-1 ml-2 text-base font-black text-gray-800"
                  />
                </View>
              </View>

              <View className="w-[48%]">
                <Text className="text-gray-400 font-black text-[10px] uppercase mb-2">Duration</Text>
                <View className="bg-gray-50 rounded-2xl px-4 py-4 flex-row items-center">
                  <TextInput
                    placeholder="1"
                    keyboardType="numeric"
                    value={days}
                    onChangeText={setDays}
                    className="flex-1 text-base font-black text-gray-800"
                  />
                  <Text className="text-gray-400 text-xs font-bold ml-1">days</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Vibe Selection */}
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

        {/* Travel Notes */}
        <View className="mx-6 mt-6 mb-10">
          <View className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <Text className="text-gray-800 font-black text-lg mb-4">Travel Notes</Text>
            <View className="bg-gray-50 rounded-2xl p-4">
              <TextInput
                placeholder="Bucket list, restaurants, plans..."
                multiline
                numberOfLines={4}
                value={notes}
                onChangeText={setNotes}
                className="text-gray-800 text-base min-h-[100px]"
                textAlignVertical="top"
              />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Action Button */}
      <View className="px-6 pb-12 pt-4 bg-gray-50">
        <TouchableOpacity 
          disabled={loading}
          onPress={handleCreate}
          className="rounded-3xl overflow-hidden shadow-xl"
        >
          <LinearGradient
            colors={loading ? ['#cccccc', '#aaaaaa'] : ['#26cc00', '#22b800']}
            className="py-5 flex-row justify-center items-center"
          >
            <Ionicons name={loading ? "sync" : "airplane"} size={24} color="white" />
            <Text className="text-white text-xl font-black ml-3">
              {loading ? "Saving..." : "Start Journey"}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

export default CreateTrip