import { View, Text, TouchableOpacity, ScrollView, Image, FlatList } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'expo-router'
import { db } from '@/lib/firebase'
import { collection, query, where, onSnapshot, orderBy, limit } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'

const Home = () => {
  const router = useRouter()
  const auth = getAuth()
  const user = auth.currentUser
  const [trips, setTrips] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    const q = query(
      collection(db, "trips"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc"),
      limit(3)
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setTrips(list)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  return (
    <View className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        
        {/* Header Section */}
        <LinearGradient
          colors={['#26cc00', '#1b9400']}
          className="px-6 pt-16 pb-20 rounded-b-[50px]"
        >
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-white/80 font-bold text-sm uppercase tracking-widest">Adventure Awaits</Text>
              <Text className="text-white text-3xl font-black mt-1">Hi, {user?.displayName?.split(' ')[0] || 'Traveler'}!</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/profile')}>
              <Image 
                source={{ uri: user?.photoURL || 'https://cdn-icons-png.flaticon.com/512/1144/1144760.png' }}
                className="w-14 h-14 rounded-2xl border-2 border-white/30"
              />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Featured Action Card */}
        <View className="px-6 -mt-10">
          <TouchableOpacity 
            onPress={() => router.push('/create-trip')}
            className="bg-white rounded-[35px] p-6 shadow-xl shadow-green-900/20 border border-green-50"
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-1 pr-4">
                <Text className="text-gray-900 text-xl font-black mb-1">Where to next?</Text>
                <Text className="text-gray-500 text-sm leading-5">Plan your dream journey with JourneyMate.</Text>
                <View className="bg-[#26cc00] self-start px-4 py-2 rounded-xl mt-4">
                  <Text className="text-white font-black text-xs">Plan New Trip</Text>
                </View>
              </View>
              <View className="bg-green-50 p-5 rounded-full">
                <Ionicons name="airplane" size={40} color="#26cc00" />
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Quick Tools Grid */}
        <View className="px-6 mt-8">
          <Text className="text-gray-900 text-xl font-black mb-4">Travel Tools</Text>
          <View className="flex-row justify-between">
            <TouchableOpacity onPress={() => router.push('/budget')} className="w-[48%] bg-gray-50 p-5 rounded-3xl items-center border border-gray-100">
              <View className="bg-white p-3 rounded-2xl shadow-sm mb-3">
                <Ionicons name="wallet" size={24} color="#26cc00" />
              </View>
              <Text className="font-black text-gray-800">Budget</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/checklist')} className="w-[48%] bg-gray-50 p-5 rounded-3xl items-center border border-gray-100">
              <View className="bg-white p-3 rounded-2xl shadow-sm mb-3">
                <Ionicons name="list" size={24} color="#3b82f6" />
              </View>
              <Text className="font-black text-gray-800">Checklist</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Trips List */}
        <View className="px-6 mt-10">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-gray-900 text-xl font-black">My Journeys</Text>
            <TouchableOpacity onPress={() => router.push('/(dashboard)/(tabs)/journeys')}>
              <Text className="text-[#26cc00] font-bold">See All</Text>
            </TouchableOpacity>
          </View>

          {trips.length > 0 ? (
            trips.map((trip) => (
              <TouchableOpacity 
                key={trip.id}
                onPress={() => router.push({ pathname: '/trip-details', params: trip })}
                className="bg-white border border-gray-100 rounded-[30px] p-4 mb-4 flex-row items-center shadow-sm"
              >
                <Image 
                  source={{ uri: `https://loremflickr.com/200/200/${trip.name},travel` }}
                  className="w-16 h-16 rounded-2xl"
                />
                <View className="ml-4 flex-1">
                  <Text className="text-gray-900 font-black text-lg" numberOfLines={1}>{trip.name}</Text>
                  <View className="flex-row items-center mt-1">
                    <Ionicons name="calendar-outline" size={12} color="#9ca3af" />
                    <Text className="text-gray-400 text-xs ml-1 font-bold">{trip.days} Days • {trip.category}</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
              </TouchableOpacity>
            ))
          ) : (
            <View className="bg-gray-50 py-10 rounded-[35px] items-center border border-dashed border-gray-300">
              <Ionicons name="map-outline" size={40} color="#d1d5db" />
              <Text className="text-gray-400 font-bold mt-2">No trips planned yet.</Text>
            </View>
          )}
        </View>

      </ScrollView>
    </View>
  )
}

export default Home