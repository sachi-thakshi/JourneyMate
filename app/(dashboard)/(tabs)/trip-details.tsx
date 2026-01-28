import { View, Text, ScrollView, Image, TouchableOpacity, SafeAreaView, Share, Alert } from 'react-native'
import React, { useMemo } from 'react'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'

const TripDetails = () => {
  const router = useRouter()
  const params = useLocalSearchParams()
  
  const { id, name, budget, category, notes, days, startDate, endDate } = params

  const daysUntilTrip = useMemo(() => {
    if (!startDate) return null
    const start = new Date(startDate as string)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const diffTime = start.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }, [startDate])

  const onShare = async () => {
    try {
      const message = `🌍 Trip to ${name}!\n\n` +
        `📅 Dates: ${startDate} - ${endDate}\n` +
        `💰 Budget: $${budget}\n` +
        `📝 Notes: ${notes || 'No extra notes'}\n\n` +
        `Planned with JourneyMate`

      await Share.share({ message })
    } catch (error) {
      Alert.alert("Error", "Could not share this trip.")
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
        
        {/* Hero Section */}
        <View className="relative h-[400px] w-full">
          <Image 
            source={{ uri: `https://loremflickr.com/800/800/${name},travel/all` }} 
            className="w-full h-full"
            resizeMode="cover"
          />
          <LinearGradient
            colors={['rgba(0,0,0,0.3)', 'transparent', 'rgba(0,0,0,0.8)']}
            className="absolute inset-0"
          />

          {/* Navigation Controls */}
          <View className="absolute top-12 left-6 right-6 flex-row justify-between">
            <TouchableOpacity 
              onPress={() => router.back()}
              className="p-3 bg-white/90 rounded-2xl shadow-lg"
            >
              <Ionicons name="chevron-back" size={24} color="black" />
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={onShare}
              className="p-3 bg-white/90 rounded-2xl shadow-lg"
            >
              <Ionicons name="share-outline" size={24} color="#26cc00" />
            </TouchableOpacity>
          </View>

          {/* Bottom Title Info */}
          <View className="absolute bottom-0 left-0 right-0 px-6 pb-10">
            <View className="bg-[#26cc00] px-4 py-1.5 rounded-full self-start mb-3">
              <Text className="text-white text-xs font-black uppercase tracking-widest">
                {category || "Explore"}
              </Text>
            </View>
            <Text className="text-white text-5xl font-black">{name}</Text>
            
            {daysUntilTrip !== null && (
              <View className="flex-row items-center mt-2">
                <Ionicons name="time-outline" size={16} color="white" />
                <Text className="text-white/90 ml-1 font-bold">
                  {daysUntilTrip > 0 ? `${daysUntilTrip} days to go!` : 'Journey started!'}
                </Text>
              </View>
            )}
          </View>
        </View>

        <View className="px-6 -mt-8">
          
          {/* Main Info Card */}
          <View className="bg-white rounded-[40px] p-6 mb-6 shadow-xl shadow-black/5">
            <View className="flex-row justify-between items-center pb-6 border-b border-gray-50">
              <View className="items-center flex-1">
                <Text className="text-gray-400 font-black text-[10px] uppercase mb-1">Budget</Text>
                <Text className="text-2xl font-black text-gray-900">${budget}</Text>
              </View>
              <View className="w-[1px] h-10 bg-gray-100" />
              <View className="items-center flex-1">
                <Text className="text-gray-400 font-black text-[10px] uppercase mb-1">Duration</Text>
                <Text className="text-2xl font-black text-gray-900">{days} Days</Text>
              </View>
            </View>

            {/* Date Details */}
            <View className="flex-row justify-between items-center mt-6 px-4">
               <View>
                 <Text className="text-gray-400 font-black text-[10px] uppercase">Departure</Text>
                 <Text className="text-gray-900 font-bold text-lg">{startDate}</Text>
               </View>
               <View className="bg-green-50 p-2 rounded-full">
                 <Ionicons name="airplane" size={20} color="#26cc00" />
               </View>
               <View className="items-end">
                 <Text className="text-gray-400 font-black text-[10px] uppercase">Return</Text>
                 <Text className="text-gray-900 font-bold text-lg">{endDate}</Text>
               </View>
            </View>
          </View>

          {/* Tools Section */}
          <Text className="text-gray-900 text-2xl font-black mb-4 ml-2">Journey Tools</Text>
          <View className="flex-row justify-between mb-8">
            <TouchableOpacity 
              onPress={() => router.push({ pathname: '/expenses', params: { id, name, budget } })}
              className="w-[48%] bg-white rounded-[30px] p-6 items-center shadow-md shadow-orange-500/10 border border-orange-50"
            >
              <LinearGradient colors={['#fff7ed', '#ffedd5']} className="p-4 rounded-2xl mb-3">
                <Ionicons name="card" size={28} color="#f97316" />
              </LinearGradient>
              <Text className="font-black text-gray-800">Expenses</Text>
              <Text className="text-gray-400 text-[10px] mt-1">Track Spending</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => Alert.alert("Coming Soon", "Checklist feature is currently being developed!")}
              className="w-[48%] bg-white rounded-[30px] p-6 items-center shadow-md shadow-blue-500/10 border border-blue-50"
            >
              <LinearGradient colors={['#f0f9ff', '#e0f2fe']} className="p-4 rounded-2xl mb-3">
                <Ionicons name="list" size={28} color="#3b82f6" />
              </LinearGradient>
              <Text className="font-black text-gray-800">Checklist</Text>
              <Text className="text-gray-400 text-[10px] mt-1">Packing List</Text>
            </TouchableOpacity>
          </View>

          {/* Notes Section */}
          <View className="mb-8">
            <Text className="text-gray-900 text-2xl font-black mb-4 ml-2">Trip Notes</Text>
            <View className="bg-white p-6 rounded-[35px] border border-gray-100 shadow-sm">
              <Text className="text-gray-600 leading-7 font-medium">
                {notes || "No extra notes recorded for this journey. You can add them by editing this trip."}
              </Text>
            </View>
          </View>

          {/* Edit Button */}
          <TouchableOpacity 
            onPress={() => router.push({
              pathname: '/edit-trip',
              params: { id, name, budget, category, notes, days, startDate, endDate }
            })}
            className="bg-[#26cc00] py-5 rounded-[25px] flex-row justify-center items-center shadow-xl shadow-green-500/30"
          >
            <Ionicons name="create-outline" size={22} color="white" />
            <Text className="text-white font-black text-lg ml-2">Edit Trip Details</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default TripDetails