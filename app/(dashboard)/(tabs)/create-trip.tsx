import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native'
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

  const categories = [
    { name: 'Adventure', icon: 'rocket', color: '#FF6B6B' },
    { name: 'Relax', icon: 'sunny', color: '#4ECDC4' },
    { name: 'Culture', icon: 'library', color: '#95E1D3' },
    { name: 'Food', icon: 'restaurant', color: '#FFE66D' },
    { name: 'Beach', icon: 'water', color: '#00B4D8' },
    { name: 'City', icon: 'business', color: '#A8DADC' }
  ]

  const handleCreate = async () => {
    if (!tripName.trim()) {
      Alert.alert("Error", "Please enter a destination")
      return
    }
    if (!rootNavigationState?.key) return

    setLoading(true)
    try {
      // 1. Save data to Firestore backend
      await addTrip(tripName, budget, category, days, notes)
      
      setTimeout(() => {
        router.push({
          pathname: '/trip-details',
          params: { name: tripName, budget, category, notes, days }
        })
      }, 150)

      setTripName("")
      setBudget("")
      setCategory("Adventure")
      setNotes("")
      setDays("1")
    } catch (error) {
      console.error("Firebase Error:", error)
      Alert.alert("Error", "Could not save your trip. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-gray-50"
    >
      <LinearGradient
        colors={['#26cc00', '#22b800']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="pt-16 px-6 pb-6"
        style={{
          shadowColor: '#26cc00',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8
        }}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            <TouchableOpacity 
              onPress={() => router.back()} 
              className="p-3 bg-white/20 rounded-full"
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <View className="ml-4">
              <Text className="text-white text-2xl font-bold">Plan Your Trip</Text>
              <Text className="text-white/80 text-sm mt-0.5">Where will you go next?</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      <ScrollView 
        className="flex-1" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Destination Card */}
        <View className="mx-6 mt-6">
          <View className="bg-white rounded-3xl p-6 shadow-md"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 4
            }}
          >
            <View className="flex-row items-center mb-3">
              <View style={{ backgroundColor: '#26cc00' }} className="p-2 rounded-xl">
                <Ionicons name="location" size={20} color="white" />
              </View>
              <Text className="text-gray-800 font-bold text-lg ml-3">Destination</Text>
            </View>
            
            <View className="flex-row items-center bg-gray-50 rounded-2xl px-4 py-4 mt-2">
              <Ionicons name="map-outline" size={24} color="#26cc00" />
              <TextInput
                placeholder="Where to? (e.g., Paris, Bali)"
                value={tripName}
                onChangeText={setTripName}
                className="flex-1 ml-3 text-base text-gray-800"
                placeholderTextColor="#9ca3af"
              />
            </View>
          </View>
        </View>

        {/* Budget & Duration Card */}
        <View className="mx-6 mt-6">
          <View className="bg-white rounded-3xl p-6 shadow-md"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 4
            }}
          >
            <View className="flex-row items-center mb-4">
              <View style={{ backgroundColor: '#26cc00' }} className="p-2 rounded-xl">
                <Ionicons name="cash" size={20} color="white" />
              </View>
              <Text className="text-gray-800 font-bold text-lg ml-3">Trip Details</Text>
            </View>

            <View className="flex-row justify-between">
              {/* Budget */}
              <View className="w-[48%]">
                <Text className="text-gray-500 font-semibold text-xs uppercase tracking-wider mb-2">Budget</Text>
                <View className="bg-gray-50 rounded-2xl px-4 py-4 flex-row items-center">
                  <Text className="text-gray-400 text-lg font-bold">$</Text>
                  <TextInput
                    placeholder="0"
                    keyboardType="numeric"
                    value={budget}
                    onChangeText={setBudget}
                    className="flex-1 ml-2 text-base font-semibold text-gray-800"
                    placeholderTextColor="#9ca3af"
                  />
                </View>
              </View>

              {/* Days */}
              <View className="w-[48%]">
                <Text className="text-gray-500 font-semibold text-xs uppercase tracking-wider mb-2">Duration</Text>
                <View className="bg-gray-50 rounded-2xl px-4 py-4 flex-row items-center">
                  <TextInput
                    placeholder="1"
                    keyboardType="numeric"
                    value={days}
                    onChangeText={setDays}
                    className="flex-1 text-base font-semibold text-gray-800"
                    placeholderTextColor="#9ca3af"
                  />
                  <Text className="text-gray-400 text-sm font-medium ml-1">days</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Trip Vibe Card */}
        <View className="mx-6 mt-6">
          <View className="bg-white rounded-3xl p-6 shadow-md"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 4
            }}
          >
            <View className="flex-row items-center mb-4">
              <View style={{ backgroundColor: '#26cc00' }} className="p-2 rounded-xl">
                <Ionicons name="sparkles" size={20} color="white" />
              </View>
              <Text className="text-gray-800 font-bold text-lg ml-3">Trip Vibe</Text>
            </View>

            <View className="flex-row flex-wrap">
              {categories.map((item, index) => (
                <TouchableOpacity
                  key={item.name}
                  onPress={() => setCategory(item.name)}
                  className="rounded-2xl mr-3 mb-3 overflow-hidden"
                  style={{
                    width: '30%',
                    backgroundColor: category === item.name ? '#26cc00' : '#f3f4f6'
                  }}
                >
                  <View className="p-4 items-center">
                    <View 
                      className="p-2 rounded-xl mb-2"
                      style={{ 
                        backgroundColor: category === item.name ? 'rgba(255,255,255,0.2)' : item.color + '20'
                      }}
                    >
                      <Ionicons 
                        name={item.icon as any} 
                        size={24} 
                        color={category === item.name ? 'white' : item.color} 
                      />
                    </View>
                    <Text 
                      className="font-bold text-xs text-center"
                      style={{ color: category === item.name ? 'white' : '#6b7280' }}
                    >
                      {item.name}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Travel Notes Card */}
        <View className="mx-6 mt-6 mb-6">
          <View className="bg-white rounded-3xl p-6 shadow-md"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 4
            }}
          >
            <View className="flex-row items-center mb-4">
              <View style={{ backgroundColor: '#26cc00' }} className="p-2 rounded-xl">
                <Ionicons name="pencil" size={20} color="white" />
              </View>
              <Text className="text-gray-800 font-bold text-lg ml-3">Travel Notes</Text>
            </View>

            <View className="bg-gray-50 rounded-2xl p-4">
              <TextInput
                placeholder="✨ Write your bucket list, must-see places, or any special plans..."
                multiline
                numberOfLines={5}
                value={notes}
                onChangeText={setNotes}
                className="text-gray-800 text-base min-h-[120px]"
                textAlignVertical="top"
                placeholderTextColor="#9ca3af"
              />
            </View>

            <View className="flex-row items-center mt-4 bg-blue-50 p-3 rounded-xl">
              <Ionicons name="information-circle" size={20} color="#3b82f6" />
              <Text className="text-blue-600 text-xs ml-2 flex-1">
                Pro tip: Add specific activities or restaurants you want to try!
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Create Button */}
      <View className="px-6 pb-32 pt-4 bg-gray-50">
        <TouchableOpacity 
          disabled={loading}
          className="rounded-3xl overflow-hidden"
          style={{
            shadowColor: '#26cc00',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.4,
            shadowRadius: 12,
            elevation: 10
          }}
          onPress={handleCreate}
        >
          <LinearGradient
            colors={loading ? ['#cccccc', '#aaaaaa'] : ['#26cc00', '#22b800']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="py-5 flex-row justify-center items-center"
          >
            {loading ? (
              <Ionicons name="sync" size={24} color="white" className="animate-none" />
            ) : (
              <Ionicons name="airplane" size={24} color="white" />
            )}
            <Text className="text-white text-center text-xl font-extrabold ml-3">
              {loading ? "Saving Trip..." : "Start Journey"}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Quick Stats */}
        <View className="flex-row justify-center items-center mt-4 space-x-4">
          <View className="flex-row items-center">
            <Ionicons name="checkmark-circle" size={16} color="#26cc00" />
            <Text className="text-gray-500 text-xs ml-1">Auto-saved</Text>
          </View>
          <View className="flex-row items-center">
            <Ionicons name="lock-closed" size={16} color="#26cc00" />
            <Text className="text-gray-500 text-xs ml-1">Secure</Text>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}

export default CreateTrip