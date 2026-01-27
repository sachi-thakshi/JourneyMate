import { View, Text, TouchableOpacity, ScrollView, Image, Pressable } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { useAuth } from '@/hooks/useAuth'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'

interface Trip {
  name: string | string[]
  budget: string | string[]
  category: string | string[]
  days: string | string[]
  notes: string | string[]
}

interface PopularPlace {
  id: number
  name: string
  location: string
  image: string
  rating: number
  price: string
  category: string
}

const popularPlaces: PopularPlace[] = [
  {
    id: 1,
    name: 'Bali, Indonesia',
    location: 'Southeast Asia',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800',
    rating: 4.8,
    price: '$1,200',
    category: 'Beach Paradise'
  },
  {
    id: 2,
    name: 'Paris, France',
    location: 'Europe',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
    rating: 4.9,
    price: '$2,500',
    category: 'City Romance'
  },
  {
    id: 3,
    name: 'Tokyo, Japan',
    location: 'East Asia',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
    rating: 4.7,
    price: '$2,000',
    category: 'Urban Adventure'
  },
  {
    id: 4,
    name: 'Maldives',
    location: 'Indian Ocean',
    image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800',
    rating: 4.9,
    price: '$3,500',
    category: 'Luxury Escape'
  },
  {
    id: 5,
    name: 'New York, USA',
    location: 'North America',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800',
    rating: 4.6,
    price: '$1,800',
    category: 'City Lights'
  },
  {
    id: 6,
    name: 'Santorini, Greece',
    location: 'Mediterranean',
    image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800',
    rating: 4.8,
    price: '$2,200',
    category: 'Island Beauty'
  }
]

const Home = () => {
  const router = useRouter()
  const { user } = useAuth()
  const params = useLocalSearchParams()
  
  const [trips, setTrips] = useState<Trip[]>([])

  useEffect(() => {
    if (params.name) {
      const newTrip: Trip = {
        name: params.name,
        budget: params.budget,
        category: params.category,
        days: params.days,
        notes: params.notes
      }
      
      setTrips((prev) => {
        const exists = prev.find(t => t.name === newTrip.name && t.budget === newTrip.budget)
        return exists ? prev : [newTrip, ...prev]
      })
    }
  }, [params])

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header Section */}
      <LinearGradient
        colors={['#26cc00', '#22b800']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="px-6 pt-16 pb-8 rounded-b-3xl"
        style={{ 
          shadowColor: '#26cc00',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8
        }}
      >
        <View className="flex-row justify-between items-center mb-6">
          <View className='flex-1'>
            <Text className="text-white/80 text-base font-medium">Welcome back,</Text>
            <Text className="text-white text-3xl font-extrabold mt-1">
              {user?.displayName || 'Traveler'}!
            </Text>
          </View>

          <TouchableOpacity onPress={() => router.push('/profile')}>
            <View className="rounded-full border-3 border-white shadow-lg">
              <Image 
                source={{ uri: user?.photoURL || 'https://cdn-icons-png.flaticon.com/512/1144/1144760.png' }}
                className="w-16 h-16 rounded-full"
              />
            </View>
          </TouchableOpacity>
        </View>

        {/* Budget Card - Nested inside header */}
        <View className="bg-white/20 backdrop-blur-lg p-5 rounded-2xl border border-white/30">
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-white/90 text-sm font-medium">Total Travel Budget</Text>
              <Text className="text-white text-3xl font-bold mt-1">$100,000</Text>
            </View>
            <View className="bg-white/20 p-3 rounded-full">
              <Ionicons name="wallet" size={28} color="white" />
            </View>
          </View>
        </View>
      </LinearGradient>

      <ScrollView 
        className="flex-1" 
        contentContainerStyle={{ paddingBottom: 200 }}
        showsVerticalScrollIndicator={false}
      >

        {/* Popular Travel Places Section */}
        <View className="px-6 mt-8">
          <View className="flex-row justify-between items-center mb-4">
            <View>
              <Text className="text-gray-800 text-2xl font-bold">Popular Destinations</Text>
              <Text className="text-gray-500 text-sm mt-1">Discover amazing places</Text>
            </View>
            <TouchableOpacity className="bg-gray-100 p-2 rounded-full">
              <Ionicons name="search" size={20} color="#26cc00" />
            </TouchableOpacity>
          </View>

          {popularPlaces.map((place) => (
            <TouchableOpacity
              key={place.id}
              activeOpacity={0.9}
              className="bg-white rounded-3xl mb-4 overflow-hidden shadow-lg"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 5
              }}
            >
              {/* Image Section */}
              <View className="relative">
                <Image 
                  source={{ uri: place.image }}
                  className="w-full h-48"
                  resizeMode="cover"
                />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.7)']}
                  className="absolute bottom-0 left-0 right-0 h-24"
                />
                
                {/* Category Badge */}
                <View className="absolute top-3 left-3 bg-white/95 px-3 py-1.5 rounded-full">
                  <Text className="text-xs font-bold" style={{ color: '#26cc00' }}>
                    {place.category}
                  </Text>
                </View>

                {/* Rating Badge */}
                <View className="absolute top-3 right-3 bg-white/95 px-3 py-1.5 rounded-full flex-row items-center">
                  <Ionicons name="star" size={14} color="#FFD700" />
                  <Text className="text-xs font-bold text-gray-800 ml-1">{place.rating}</Text>
                </View>

                {/* Place Name on Image */}
                <View className="absolute bottom-3 left-3 right-3">
                  <Text className="text-white text-2xl font-bold">{place.name}</Text>
                  <View className="flex-row items-center mt-1">
                    <Ionicons name="location" size={14} color="white" />
                    <Text className="text-white/90 text-sm ml-1">{place.location}</Text>
                  </View>
                </View>
              </View>

              {/* Info Section */}
              <View className="p-4 flex-row justify-between items-center">
                <View className="flex-row items-center">
                  <Ionicons name="cash-outline" size={20} color="#26cc00" />
                  <Text className="text-gray-800 font-bold text-lg ml-2">{place.price}</Text>
                  <Text className="text-gray-500 text-sm ml-1">avg/person</Text>
                </View>
                
                <TouchableOpacity 
                  style={{ backgroundColor: '#26cc00' }}
                  className="px-6 py-2.5 rounded-full flex-row items-center"
                >
                  <Text className="text-white font-bold mr-2">Explore</Text>
                  <Ionicons name="arrow-forward" size={16} color="white" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <View className="absolute bottom-32 right-6 left-6">
        <Pressable
          className="w-full py-4 rounded-2xl flex-row justify-center items-center active:opacity-90"
          style={{
            backgroundColor: '#26cc00',
            shadowColor: '#26cc00',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.4,
            shadowRadius: 12,
            elevation: 10
          }}
          onPress={() => router.push('/create-trip')}
        >
          <Ionicons name="add-circle" size={24} color="white" />
          <Text className="text-white text-xl font-bold ml-2">Plan New Trip</Text>
        </Pressable>
      </View>
    </View>
  )
}

export default Home