import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator, RefreshControl, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { deleteTrip, getAllTrips } from '@/lib/tripService' 
import { LinearGradient } from 'expo-linear-gradient'

interface Trip {
  id: string
  name: string
  budget: string
  category: string
  days: string
  notes: string
}

const Journeys = () => {
  const router = useRouter()
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchTrips = async () => {
    try {
      const data = await getAllTrips()
      setTrips(data || [])
    } catch (error) {
      console.error("Error fetching trips:", error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchTrips()
  }, [])

  const onRefresh = () => {
    setRefreshing(true)
    fetchTrips()
  }

  const handleDelete = (tripId: string, tripName: string) => {
    Alert.alert(
      "Delete Journey",
      `Are you sure you want to delete your trip to ${tripName}?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: async () => {
            try {
              await deleteTrip(tripId)
              // Refresh the list locally so it disappears immediately
              setTrips(prev => prev.filter(t => t.id !== tripId))
            } catch (error) {
              Alert.alert("Error", "Could not delete the trip.")
            }
          } 
        }
      ]
    )
  }

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gradient-to-b from-gray-50 to-white">
        <ActivityIndicator size="large" color="#26cc00" />
        <Text className="text-gray-400 mt-4 font-medium">Loading your journeys...</Text>
      </View>
    )
  }

  return (
    <View className="flex-1 bg-gray-50">
      <LinearGradient
        colors={['#ffffff', '#f9fafb']}
        className="pt-16 px-6 pb-8"
      >
        <View className="flex-row justify-between items-center mb-2">
          <View>
            <Text className="text-4xl font-black text-gray-900 mb-1">My Journeys</Text>
            <Text className="text-gray-500 font-semibold text-base">
              {trips.length} {trips.length === 1 ? 'adventure' : 'adventures'} await
            </Text>
          </View>
          <TouchableOpacity 
            onPress={() => router.push('/create-trip')}
            className="bg-green-500 w-14 h-14 rounded-2xl items-center justify-center shadow-lg"
            style={{ shadowColor: '#26cc00', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}
          >
            <Ionicons name="add" size={28} color="white" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView 
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 8, paddingBottom: 120 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#26cc00" />
        }
      >
        {trips.length > 0 ? (
          trips.map((trip, index) => (
            <TouchableOpacity 
              key={trip.id}
              activeOpacity={0.9}
              className="mb-6 bg-white rounded-3xl overflow-hidden"
              style={{ 
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.1,
                shadowRadius: 16,
                elevation: 8
              }}
              onPress={() => router.push({
                pathname: '/trip-details',
                params: { ...trip }
              })}
            >
              <View className="relative h-52 w-full">
                <Image 
                  source={{ uri: `https://loremflickr.com/600/400/${trip.name},travel/all` }} 
                  className="w-full h-full"
                  style={{ resizeMode: 'cover' }}
                />

                <TouchableOpacity 
                  onPress={() => handleDelete(trip.id, trip.name)}
                  className="absolute top-4 right-4 bg-red-600/30 p-2 rounded-full backdrop-blur-md"
                >
                  <Ionicons name="trash-outline" size={20} color="white" />
                </TouchableOpacity>

                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.75)']}
                  className="absolute bottom-0 left-0 right-0 h-32 px-6 pb-5 justify-end"
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1">
                      <Text className="text-white text-3xl font-black mb-1">{trip.name}</Text>
                      <View className="flex-row items-center mt-1">
                        <View className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/30">
                          <Text className="text-white text-xs font-bold uppercase tracking-wider">
                            {trip.category}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View className="bg-white/20 backdrop-blur-sm p-3 rounded-full border border-white/30">
                      <Ionicons name="arrow-forward" size={20} color="white" />
                    </View>
                  </View>
                </LinearGradient>
              </View>

              {/* Trip Info Footer with Cards */}
              <View className="p-6">
                <View className="flex-row justify-between">
                  {/* Days Card */}
                  <View className="flex-1 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-4 mr-2">
                    <View className="flex-row items-center mb-1">
                      <View className="bg-white p-2 rounded-xl mr-2 shadow-sm">
                        <Ionicons name="calendar" size={16} color="#26cc00" />
                      </View>
                      <Text className="text-gray-500 text-xs font-semibold uppercase">Duration</Text>
                    </View>
                    <Text className="text-gray-900 text-lg font-black mt-1">{trip.days} Days</Text>
                  </View>

                  {/* Budget Card */}
                  <View className="flex-1 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 ml-2">
                    <View className="flex-row items-center mb-1">
                      <View className="bg-white p-2 rounded-xl mr-2 shadow-sm">
                        <Ionicons name="wallet" size={16} color="#3b82f6" />
                      </View>
                      <Text className="text-gray-500 text-xs font-semibold uppercase">Budget</Text>
                    </View>
                    <Text className="text-gray-900 text-lg font-black mt-1">${trip.budget}</Text>
                  </View>
                </View>

                {/* Notes Preview (if available) */}
                {trip.notes && trip.notes.length > 0 && (
                  <View className="mt-4 bg-gray-50 rounded-2xl p-4 flex-row items-start">
                    <Ionicons name="document-text-outline" size={16} color="#9ca3af" className="mt-0.5" />
                    <Text className="text-gray-600 text-sm ml-2 flex-1" numberOfLines={2}>
                      {trip.notes}
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View className="items-center justify-center mt-32">
            <LinearGradient
              colors={['#f9fafb', '#f3f4f6']}
              className="p-12 rounded-full mb-6"
            >
              <Ionicons name="airplane-outline" size={80} color="#d1d5db" />
            </LinearGradient>
            <Text className="text-2xl font-black text-gray-800 mb-2">No Journeys Yet</Text>
            <Text className="text-gray-500 font-medium text-center mb-8 px-12">
              Start planning your next adventure and create unforgettable memories
            </Text>
            <TouchableOpacity 
              onPress={() => router.push('/create-trip')}
              className="bg-green-500 px-8 py-4 rounded-2xl shadow-lg flex-row items-center"
              style={{ 
                shadowColor: '#26cc00',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8
              }}
            >
              <Ionicons name="add-circle" size={24} color="white" />
              <Text className="text-white font-black text-lg ml-2">Create Your First Trip</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  )
}

export default Journeys