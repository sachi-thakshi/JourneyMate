import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, Modal, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { getPlaceDetails } from '@/lib/aiService'
import { LinearGradient } from 'expo-linear-gradient'

interface Place {
  id?: string;
  name: string;
  city: string;
  img: string;
  description?: string;
  importance?: string;
  howToGo?: string;
  bestTime?: string;
  budgetLevel?: string;
  topActivities?: string;
  category?: string;
}

const Explore = () => {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null)

  const featuredPlaces: Place[] = [
    { id: 'f1', name: 'Sigiriya', city: 'Sri Lanka', img: 'https://images.unsplash.com/photo-1612862862126-865765df2ded?w=600', description: 'Ancient rock fortress.' },
    { id: 'f2', name: 'Eiffel Tower', city: 'Paris', img: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=500', description: 'The iconic iron lady.' },
    { id: 'f3', name: 'Kyoto', city: 'Japan', img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=500', description: 'Cultural heart of Japan.' },
    { id: 'f4', name: 'Santorini', city: 'Greece', img: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600', description: 'Stunning sunsets and blue domes.' },
    { id: 'f5', name: 'Machu Picchu', city: 'Peru', img: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=600', description: 'Lost city of the Incas.' },
    { id: 'f6', name: 'Taj Mahal', city: 'India', img: 'https://plus.unsplash.com/premium_photo-1661885523029-fc960a2bb4f3?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', description: 'A timeless monument of love.' },
    { id: 'f7', name: 'Great Wall', city: 'China', img: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=600', description: 'The world longest fortification.' },
    { id: 'f8', name: 'Colosseum', city: 'Rome', img: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600', description: 'The heart of the Roman Empire.' }
  ]

  const searchPlaces = async (text: string) => {
    setQuery(text)
    if (text.length > 2) {
      setLoading(true)
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
        setLoading(false)
      }
    } else {
      setSuggestions([])
    }
  }

  const fetchPlaceDetailsFromAI = async (placeName: string) => {
    setLoading(true)
    const details = await getPlaceDetails(placeName)
    
    setSelectedPlace((prev: any) => (prev ? { ...prev, ...details } : null))
    setLoading(false)
  }

  return (
    <View className="flex-1 bg-[#f2fdf6]">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header Section */}
        <LinearGradient
          colors={['#ffffff', '#ecfdf3']}
          className="px-6 pt-16 pb-8"
        >
          <View className="mb-6">
            <Text className="text-4xl font-black text-[#14532d] mb-1">Explore</Text>
            <Text className="text-[#16a34a] font-semibold text-base">Discover amazing destinations worldwide</Text>
          </View>

          {/* Checklist Quick Access */}
          <TouchableOpacity 
            onPress={() => router.push('/checklist')}
            activeOpacity={0.9}
            className="bg-white rounded-3xl overflow-hidden shadow-lg"
            style={{ shadowColor: '#26cc00', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12 }}
          >
            <LinearGradient
              colors={['#f0fdf4', '#dcfce7']}
              className="p-5 flex-row items-center"
            >
              <View 
               className="p-4 rounded-2xl mr-4"
               style={{ backgroundColor: '#26cc00' }}
              >
                <Ionicons name="list-circle" size={32} color="white" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-900 font-black text-xl mb-0.5">My Checklist</Text>
                <Text className="text-gray-600 text-sm font-semibold">Manage packing & tasks</Text>
              </View>
              <View className="bg-[#26cc00]/10 p-2 rounded-xl">
                <Ionicons name="chevron-forward" size={22} color="#26cc00" />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </LinearGradient>

        <View className="px-6">
          {/* Search Section Container */}
          <View className="relative z-50 mb-8 -mt-4"> 
            <View className="bg-white rounded-2xl shadow-lg overflow-hidden" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12 }}>
              <View className="flex-row items-center px-5 h-16">
                <View className="p-2 rounded-xl mr-3" style={{ backgroundColor: '#26cc00' }}>
                  <Ionicons name="search" size={20} color="white" />
                </View>
                <TextInput
                  placeholder="Search destinations worldwide..."
                  placeholderTextColor="#9ca3af"
                  value={query}
                  onChangeText={searchPlaces}
                  className="flex-1 text-base font-bold text-gray-900"
                />
                {loading && !selectedPlace && <ActivityIndicator size="small" color="#26cc00" />}
              </View>
            </View>

            {suggestions.length > 0 && (
              <View 
                className="bg-white border border-gray-200 rounded-2xl shadow-2xl absolute left-0 right-0 z-[100] overflow-hidden" 
                style={{ top: 72, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 20 }}
              >
                <ScrollView style={{ maxHeight: 300 }}>
                  {suggestions.map((item, index) => (
                    <TouchableOpacity 
                      key={index}
                      onPress={() => {
                        const info = {
                          name: item.display_name.split(',')[0],
                          city: item.display_name.split(',').slice(1, 3).join(','),
                          img: `https://loremflickr.com/600/400/${item.display_name.split(',')[0]},travel/all`
                        }
                        setSelectedPlace(info);
                        fetchPlaceDetailsFromAI(info.name);
                        setSuggestions([]);
                        setQuery("");
                      }}
                      className="px-5 py-4 border-b border-gray-100 flex-row items-center active:bg-gray-50"
                    >
                      <View className="bg-green-50 p-2 rounded-xl mr-3">
                        <Ionicons name="location" size={18} color="#26cc00" />
                      </View>
                      <Text numberOfLines={2} className="font-semibold text-gray-700 flex-1">{item.display_name}</Text>
                      <Ionicons name="arrow-forward" size={16} color="#d1d5db" />
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          {/* Famous Destinations */}
          <View className="flex-row items-center justify-between mb-5">
            <View>
              <Text className="text-2xl font-black text-[#14532d]">Famous Destinations</Text>
              <Text className="text-gray-500 font-medium text-sm">Explore iconic landmarks</Text>
            </View>
          </View>

          {featuredPlaces.map((place, index) => (
            <TouchableOpacity 
              key={place.id} 
              onPress={() => { 
                setSelectedPlace(place); 
                fetchPlaceDetailsFromAI(place.name); 
              }} 
              className="mb-6 bg-white rounded-[28px] overflow-hidden shadow-xl"
              style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.1, shadowRadius: 16 }}
            >
              <View className="relative h-52">
                <Image source={{ uri: place.img }} className="w-full h-full" resizeMode="cover" />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.8)']}
                  className="absolute bottom-0 left-0 right-0 h-32 px-6 pb-5 justify-end"
                >
                  <Text className="text-white text-2xl font-black mb-1">{place.name}</Text>
                  <View className="flex-row items-center">
                    <Ionicons name="location" size={14} color="white" />
                    <Text className="text-white/90 text-sm font-semibold ml-1">{place.city}</Text>
                  </View>
                </LinearGradient>

                {/* Badge for first 3 items */}
                {index < 3 && (
                  <View className="absolute top-4 right-4 bg-yellow-400 px-3 py-1.5 rounded-full flex-row items-center">
                    <Ionicons name="star" size={12} color="white" />
                    <Text className="text-white text-xs font-bold ml-1">Popular</Text>
                  </View>
                )}
              </View>

              <View className="p-5 flex-row items-center justify-between">
                <Text className="text-gray-600 font-medium flex-1" numberOfLines={2}>{place.description}</Text>
                <View
                  className="p-2 rounded-xl ml-3"
                  style={{ backgroundColor: '#26cc00' }}
                >
                  <Ionicons name="arrow-forward" size={18} color="white" />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Enhanced Place Detail Modal */}
      <Modal visible={!!selectedPlace} animationType="slide" transparent={true}>
        <View className="flex-1 bg-black/60">
          <TouchableOpacity 
            className="flex-1" 
            activeOpacity={1} 
            onPress={() => setSelectedPlace(null)}
          />
          <View className="bg-white rounded-t-[40px] h-[85%]">
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
              {/* Hero Image */}
              <View className="relative h-72">
                <Image 
                  source={{ uri: selectedPlace?.img }} 
                  className="w-full h-full" 
                  resizeMode="cover"
                />
                <LinearGradient
                  colors={['rgba(0,0,0,0.4)', 'transparent', 'rgba(0,0,0,0.8)']}
                  className="absolute inset-0"
                />

                {/* Close Button */}
                <TouchableOpacity 
                  onPress={() => setSelectedPlace(null)} 
                  className="absolute top-8 right-6 bg-white/90 backdrop-blur-sm p-3 rounded-2xl shadow-lg"
                >
                  <Ionicons name="close" size={24} color="#374151" />
                </TouchableOpacity>

                {/* Place Info on Image */}
                <View className="absolute bottom-0 left-0 right-0 px-6 pb-6">
                  <Text className="text-white text-4xl font-black mb-2">{selectedPlace?.name}</Text>
                  <View className="flex-row items-center">
                    <View className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/30 flex-row items-center">
                      <Ionicons name="location" size={14} color="white" />
                      <Text className="text-white text-sm font-bold ml-1">{selectedPlace?.city}</Text>
                    </View>
                  </View>
                </View>
              </View>

              <View className="px-6 pt-6">
                {loading ? (
                  <View className="py-24 items-center">
                    <View className="bg-green-50 p-8 rounded-full mb-4">
                      <ActivityIndicator size="large" color="#26cc00" />
                    </View>
                    <Text className="text-gray-900 font-bold text-lg mb-2">Generating Your Guide</Text>
                    <Text className="text-gray-400 italic text-center px-8">AI is crafting personalized recommendations...</Text>
                  </View>
                ) : (
                  <View>
                    {/* Stats Cards */}
                    <View className="flex-row justify-between mb-8">
                      <View className="flex-1 bg-gradient-to-br from-orange-50 to-orange-100 p-5 rounded-2xl mr-2 items-center">
                        <View className="bg-white p-3 rounded-xl mb-2 shadow-sm">
                          <Ionicons name="sunny" size={24} color="#f59e0b" />
                        </View>
                        <Text className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Best Time</Text>
                        <Text className="text-gray-900 font-black text-xs text-center">
                          {typeof selectedPlace?.bestTime === 'object' 
                            ? Object.values(selectedPlace.bestTime).join(', ')
                            : selectedPlace?.bestTime || "Year-round"}
                        </Text>
                      </View>

                      <View className="flex-1 bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-2xl mx-2 items-center">
                        <View className="bg-white p-3 rounded-xl mb-2 shadow-sm">
                          <Ionicons name="cash" size={24} color="#26cc00" />
                        </View>
                        <Text className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Budget</Text>
                        <Text className="text-gray-900 font-black text-xs">{selectedPlace?.budgetLevel || "$$"}</Text>
                      </View>

                      <View className="flex-1 bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-2xl ml-2 items-center">
                        <View className="bg-white p-3 rounded-xl mb-2 shadow-sm">
                          <Ionicons name="airplane" size={24} color="#3b82f6" />
                        </View>
                        <Text className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Category</Text>
                        <Text className="text-gray-900 font-black text-xs">{selectedPlace?.category || "Tour"}</Text>
                      </View>
                    </View>

                    {/* Description */}
                    <View className="mb-6">
                      <View className="flex-row items-center mb-3">
                        <Ionicons name="information-circle" size={22} color="#26cc00" />
                        <Text className="text-xl font-black text-gray-900 ml-2">About</Text>
                      </View>
                      <Text className="text-gray-700 leading-7 text-base">{selectedPlace?.description || "Discover the beauty and culture of this amazing destination."}</Text>
                    </View>

                    {/* Top Activities */}
                    {selectedPlace?.topActivities && (
                      <View className="bg-white rounded-3xl p-6 mb-6 border-2 border-blue-100">
                        <View className="flex-row items-center mb-3">
                          <View className="bg-blue-50 p-2 rounded-xl mr-3">
                            <Ionicons name="flag" size={20} color="#3b82f6" />
                          </View>
                          <Text className="text-blue-900 font-black text-lg">Top Activities</Text>
                        </View>
                        <Text className="text-blue-800 leading-6 font-medium">{selectedPlace.topActivities}</Text>
                      </View>
                    )}

                    {/* How to Reach */}
                    {selectedPlace?.howToGo && (
                      <View className="bg-white rounded-3xl p-6 mb-6 border-2 border-orange-100">
                        <View className="flex-row items-center mb-3">
                          <View className="bg-orange-50 p-2 rounded-xl mr-3">
                            <Ionicons name="navigate" size={20} color="#f97316" />
                          </View>
                          <Text className="text-orange-900 font-black text-lg">How to Reach</Text>
                        </View>
                        <Text className="text-orange-800 leading-6 font-medium">{selectedPlace.howToGo}</Text>
                      </View>
                    )}

                    {/* Action Button */}
                    <TouchableOpacity 
                      onPress={() => { 
                        Alert.alert("Added", "Place added to your checklist!"); 
                        setSelectedPlace(null); 
                      }} 
                      className="bg-green-500 py-5 rounded-2xl flex-row justify-center items-center shadow-lg mb-4"
                      style={{ shadowColor: '#26cc00', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}
                    >
                      <Ionicons name="add-circle" size={24} color="white" />
                      <Text className="text-white font-black text-lg ml-2">Add to Checklist</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      onPress={() => setSelectedPlace(null)}
                      className="bg-gray-100 py-4 rounded-2xl"
                    >
                      <Text className="text-gray-600 text-center font-bold">Close</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default Explore