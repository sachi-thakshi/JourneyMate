import { View, Text, ScrollView, Image, TouchableOpacity, SafeAreaView, Share, Alert } from 'react-native'
import React from 'react'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'

const TripDetails = () => {
  const router = useRouter()
  
  const { id, name, budget, category, notes, days } = useLocalSearchParams()

  const onShare = async () => {
    try {
      const message = `Check out my trip to ${name}! 🌍\n\n` +
        `📅 Duration: ${days} Days\n` +
        `💰 Budget: $${budget}\n` +
        `📝 Notes: ${notes}\n\n` +
        `Sent via JourneyMate App`

      const result = await Share.share({
        message: message,
      })
    } catch (error) {
      Alert.alert("Error", "Could not share this trip.")
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        
        {/* Hero Image Section */}
        <View className="relative h-96 w-full">
         <Image 
            source={{ uri: `https://loremflickr.com/800/600/${name},travel/all` }} 
            className="w-full h-full"
            resizeMode="cover"
          />
          
          {/* Gradient Overlay */}
          <LinearGradient
            colors={['rgba(0,0,0,0.4)', 'transparent', 'rgba(0,0,0,0.8)']}
            className="absolute inset-0"
          />

          {/* Back Button */}
          <TouchableOpacity 
            onPress={() => router.back()}
            className="absolute top-12 left-6 p-3 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg"
            style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 8 }}
          >
            <Ionicons name="chevron-back" size={24} color="black" />
          </TouchableOpacity>          

          {/* Trip Name on Image */}
          <View className="absolute bottom-0 left-0 right-0 px-6 pb-8">
            <View className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full self-start mb-3 border border-white/30">
              <Text className="text-white text-sm font-bold uppercase tracking-wider">
                {category || "Travel"}
              </Text>
            </View>
            <Text className="text-white text-4xl font-black drop-shadow-lg">
              {name || "Trip Details"}
            </Text>
          </View>
        </View>

        {/* Content Section */}
        <View className="px-6 -mt-6">
          
          {/* Stats Cards */}
          <View className="bg-white rounded-3xl p-6 mb-6 shadow-lg" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12 }}>
            <View className="flex-row justify-between">
              {/* Budget Card */}
              <View className="flex-1 items-center">
                <View className="bg-green-50 p-3 rounded-2xl mb-3">
                  <Ionicons name="wallet" size={28} color="#26cc00" />
                </View>
                <Text className="text-gray-400 text-xs font-bold uppercase mb-1">Total Budget</Text>
                <Text className="text-2xl font-black text-gray-900">${budget || "0.00"}</Text>
              </View>

              <View className="w-[1px] bg-gray-200 mx-4" />

              {/* Duration Card */}
              <View className="flex-1 items-center">
                <View className="bg-blue-50 p-3 rounded-2xl mb-3">
                  <Ionicons name="calendar" size={28} color="#3b82f6" />
                </View>
                <Text className="text-gray-400 text-xs font-bold uppercase mb-1">Duration</Text>
                <Text className="text-2xl font-black text-gray-900">{days || "1"} Days</Text>
              </View>

              <View className="w-[1px] bg-gray-200 mx-4" />

              {/* Status Card */}
              <View className="flex-1 items-center">
                <View className="bg-green-50 p-3 rounded-2xl mb-3">
                  <Ionicons name="checkmark-circle" size={28} color="#26cc00" />
                </View>
                <Text className="text-gray-400 text-xs font-bold uppercase mb-1">Status</Text>
                <Text className="text-lg font-black text-green-600">Active</Text>
              </View>
            </View>
          </View>

          {/* Journey Tools Section */}
          <View className="mb-6">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-2xl font-black text-gray-900">Journey Tools</Text>
              <Ionicons name="settings-outline" size={20} color="#9ca3af" />
            </View>
            
            <View className="flex-row justify-between mb-4">
              <TouchableOpacity 
                onPress={() => router.push('/expenses')}
                className="w-[48%] bg-white rounded-3xl overflow-hidden shadow-md"
                style={{ shadowColor: '#f97316', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12 }}
              >
                <LinearGradient
                  colors={['#ffedd5', '#fed7aa']}
                  className="p-6 items-center"
                >
                  <View className="bg-white p-4 rounded-2xl mb-3 shadow-sm">
                    <Ionicons name="card" size={32} color="#f97316" />
                  </View>
                  <Text className="font-black text-orange-900 text-base">Expenses</Text>
                  <Text className="text-orange-600 text-xs mt-1">Track spending</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>

          {/* Travel Notes Section */}
          <View className="mb-6">
            <View className="flex-row items-center mb-3">
              <Ionicons name="document-text" size={24} color="#26cc00" />
              <Text className="text-2xl font-black text-gray-900 ml-2">Travel Notes</Text>
            </View>
            <View className="bg-white p-6 rounded-3xl shadow-md border border-gray-100">
              {notes && notes.length > 0 ? (
                <Text className="text-gray-700 leading-7 text-base">
                  {notes}
                </Text>
              ) : (
                <View className="items-center py-8">
                  <View className="bg-gray-50 p-6 rounded-full mb-3">
                    <Ionicons name="create-outline" size={40} color="#d1d5db" />
                  </View>
                  <Text className="text-gray-400 font-medium italic">
                    No extra notes provided for this adventure.
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Quick Actions */}
          <View className="flex-row justify-between mb-6">
            <TouchableOpacity 
              onPress={onShare}
              className="flex-1 bg-green-500 py-4 rounded-2xl mr-2 flex-row items-center justify-center shadow-lg"
              style={{ shadowColor: '#26cc00', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}
            >
              <Ionicons name="share-social" size={20} color="white" />
              <Text className="text-white font-black ml-2 text-base">Share Trip</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={() => router.push({
                pathname: '/edit-trip',
                params: { id: id, name, budget, category, notes, days } 
              })}
              className="flex-1 bg-white py-4 rounded-2xl ml-2 flex-row items-center justify-center border-2 border-gray-200">
              <Ionicons name="create" size={20} color="#26cc00" />
              <Text className="text-green-600 font-black ml-2 text-base">Edit Trip</Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default TripDetails