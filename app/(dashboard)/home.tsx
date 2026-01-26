import { View, Text, TouchableOpacity, ScrollView, Image, Pressable } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { Ionicons } from '@expo/vector-icons'; 

const Home = () => {
  const router = useRouter()
  const { user } = useAuth()

  return (
    <View className="flex-1 bg-white">
      <View className="px-6 pt-16 pb-6 bg-white shadow-sm border-b border-gray-100">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-gray-400 text-lg font-medium">Welcome back,</Text>
            <Text style={{ color: '#26cc00' }} className="text-3xl font-extrabold">
              {user?.displayName || 'Traveler'}!
            </Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-6 pt-6">
        <View style={{ backgroundColor: '#26cc00' }} className="w-full p-6 rounded-3xl shadow-lg mb-8">
          <Text className="text-white/80 text-base font-medium">Total Travel Budget</Text>
          <Text className="text-white text-4xl font-bold mt-1">$100000.00</Text>
          <View className="flex-row mt-4 items-center">
            <Ionicons name="airplane" size={20} color="white" />
            <Text className="text-white/90 ml-2 italic">Ready for your next trip?</Text>
          </View>
        </View>

        <Text className="text-gray-800 text-2xl font-bold mb-4">My Journeys</Text>

        <View className="items-center py-10 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <Image 
             source={{ uri: 'https://cdn-icons-png.flaticon.com/512/201/201623.png' }}
             style={{ width: 80, height: 80, opacity: 0.2, tintColor: '#26cc00' }}
          />
          <Text className="text-gray-400 mt-4 text-center px-10">
            No trips planned yet. Tap the button below to start your adventure!
          </Text>
        </View>
      </ScrollView>

      <View className="absolute bottom-10 right-6 left-6">
        <Pressable
          style={{ backgroundColor: '#26cc00' }}
          className="w-full py-4 rounded-2xl shadow-xl flex-row justify-center items-center active:opacity-90"
          onPress={() => router.push('/create-trip')}
        >
          <Ionicons name="add-circle" size={24} color="white" />
          <Text className="text-white text-xl font-bold ml-2">
            Plan New Trip
          </Text>
        </Pressable>
      </View>
    </View>
  )
}

export default Home