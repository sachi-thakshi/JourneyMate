import { View, Text, ScrollView, Image, TouchableOpacity, SafeAreaView } from 'react-native'
import React from 'react'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

const TripDetails = () => {
  const router = useRouter()
  
  const { name, budget, category, notes, days } = useLocalSearchParams()

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 140 }}>
        
        <View className="relative h-80 w-full">
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1546708973-b339540b5162?q=80&w=1000&auto=format&fit=crop' }} 
            className="w-full h-full"
            resizeMode="cover"
          />
          <TouchableOpacity 
            onPress={() => router.back()}
            className="absolute top-12 left-6 p-3 bg-white/80 rounded-full"
          >
            <Ionicons name="chevron-back" size={24} color="black" />
          </TouchableOpacity>
        </View>

        <View className="px-6 -mt-10 bg-white rounded-t-[40px] pt-8">
          <View className="flex-row justify-between items-start mb-6">
            <View className="flex-1">
              <Text className="text-3xl font-extrabold text-gray-900">{name || "Trip Details"}</Text>
              <View className="flex-row items-center mt-2">
                <Ionicons name="calendar-outline" size={16} color="#26cc00" />
                <Text className="text-gray-500 ml-1 font-medium">{days || "1"} Days planned</Text>
              </View>
            </View>
            <View style={{ backgroundColor: '#26cc00' }} className="px-4 py-2 rounded-2xl">
              <Text className="text-white font-bold">{category || "Travel"}</Text>
            </View>
          </View>

          <View className="flex-row justify-between bg-gray-50 p-6 rounded-3xl mb-8 border border-gray-100">
            <View className="items-center">
              <Text className="text-gray-400 text-xs font-bold uppercase mb-1">Total Budget</Text>
              <Text className="text-xl font-bold text-gray-900">${budget || "0.00"}</Text>
            </View>
            <View className="w-[1px] h-10 bg-gray-200" />
            <View className="items-center">
              <Text className="text-gray-400 text-xs font-bold uppercase mb-1">Trip Status</Text>
              <Text className="text-xl font-bold text-[#26cc00]">Active</Text>
            </View>
          </View>

          <Text className="text-xl font-bold text-gray-900 mb-4">Journey Tools</Text>
          <View className="flex-row justify-between mb-8">
            <TouchableOpacity 
              onPress={() => router.push('/checklist')}
              className="w-[48%] bg-blue-50 p-5 rounded-3xl items-center border border-blue-100"
            >
              <Ionicons name="list-outline" size={32} color="#3b82f6" />
              <Text className="mt-2 font-bold text-blue-900">Checklist</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={() => router.push('/expenses')}
              className="w-[48%] bg-orange-50 p-5 rounded-3xl items-center border border-orange-100"
            >
              <Ionicons name="card-outline" size={32} color="#f97316" />
              <Text className="mt-2 font-bold text-orange-900">Expenses</Text>
            </TouchableOpacity>
          </View>

          <Text className="text-xl font-bold text-gray-900 mb-2">Travel Notes</Text>
          <View className="bg-gray-50 p-5 rounded-3xl border border-gray-100">
            <Text className="text-gray-600 leading-6 italic">
              {notes || "No extra notes provided for this adventure."}
            </Text>
          </View>
        </View>

        <TouchableOpacity 
            onPress={() => router.replace({
                pathname: '/home',
                params: { name, budget, category, notes, days }
            })}
            className="absolute top-12 left-6 p-3 bg-white/80 rounded-full"
            >
            <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

export default TripDetails