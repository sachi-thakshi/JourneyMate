import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useState } from 'react'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { updateTrip } from '@/lib/tripService'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'

const EditTrip = () => {
  const router = useRouter()
  const params = useLocalSearchParams()
  
  const [tripName] = useState(params.name?.toString() || "")
  const [budget, setBudget] = useState(params.budget as string)
  const [category, setCategory] = useState(params.category as string)
  const [notes, setNotes] = useState(params.notes as string)
  const [days, setDays] = useState(params.days as string)
  const [loading, setLoading] = useState(false)

  const categories = [
    { name: 'Adventure', icon: 'rocket', color: '#FF6B6B' },
    { name: 'Relax', icon: 'sunny', color: '#4ECDC4' },
    { name: 'Culture', icon: 'library', color: '#95E1D3' },
    { name: 'Food', icon: 'restaurant', color: '#FFE66D' },
    { name: 'Beach', icon: 'water', color: '#00B4D8' },
    { name: 'City', icon: 'business', color: '#A8DADC' }
  ]

  const handleUpdate = async () => {
    if (!tripName.trim()) return
    setLoading(true)
    try {
      await updateTrip(params.id as string, {
        name: tripName,
        budget,
        category,
        days,
        notes
      })
      Alert.alert("Success", "Trip updated successfully!")
      router.replace({
        pathname: '/trip-details',
        params: { id: params.id, name: tripName, budget, category, days, notes }
      })
    } catch (e) {
      Alert.alert("Error", "Update failed.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      className="flex-1 bg-gray-50"
    >
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        
        {/* Header */}
        <LinearGradient
          colors={['#ffffff', '#f9fafb']}
          className="px-6 pt-14 pb-8"
        >
          <View className="flex-row items-center justify-between mb-2">
            <View className="flex-1">
              <Text className="text-4xl font-black text-gray-900 mb-1">Edit Journey</Text>
              <Text className="text-gray-500 font-semibold">Update your trip details</Text>
            </View>
            <TouchableOpacity 
              onPress={() => router.back()}
              className="bg-gray-100 p-3 rounded-2xl"
            >
              <Ionicons name="close" size={24} color="#374151" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <View className="px-6 mt-2">
          {/* Destination Card */}
          <View className="bg-white rounded-3xl p-6 mb-6 shadow-md" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12 }}>
            <View className="flex-row items-center mb-3">
              <View className="bg-green-50 p-2 rounded-xl mr-3">
                <Ionicons name="location" size={20} color="#26cc00" />
              </View>
              <Text className="text-gray-400 font-bold uppercase text-xs tracking-widest">Destination</Text>
            </View>
            <View className="bg-gray-50 px-4 py-4 rounded-2xl">
              <Text className="font-black text-gray-400 text-lg">{tripName}</Text>
            </View>
            <Text className="text-gray-400 text-xs mt-2 ml-1">Destination cannot be changed</Text>
          </View>

          {/* Budget & Days Card */}
          <View className="bg-white rounded-3xl p-6 mb-6 shadow-md" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12 }}>
            <View className="flex-row items-center mb-4">
              <View className="bg-blue-50 p-2 rounded-xl mr-3">
                <Ionicons name="stats-chart" size={20} color="#3b82f6" />
              </View>
              <Text className="text-gray-400 font-bold uppercase text-xs tracking-widest">Trip Details</Text>
            </View>

            <View className="flex-row justify-between">
              {/* Budget */}
              <View className="flex-1 mr-2">
                <Text className="text-gray-500 font-bold text-xs mb-3 ml-1">BUDGET ($)</Text>
                <View className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl overflow-hidden">
                  <View className="flex-row items-center px-4 py-4">
                    <Ionicons name="wallet" size={20} color="#26cc00" />
                    <TextInput 
                      value={budget} 
                      onChangeText={setBudget} 
                      keyboardType="numeric" 
                      placeholder="0.00"
                      placeholderTextColor="#9ca3af"
                      className="flex-1 font-black text-gray-900 text-lg ml-2" 
                    />
                  </View>
                </View>
              </View>

              {/* Days */}
              <View className="flex-1 ml-2">
                <Text className="text-gray-500 font-bold text-xs mb-3 ml-1">DURATION (DAYS)</Text>
                <View className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl overflow-hidden">
                  <View className="flex-row items-center px-4 py-4">
                    <Ionicons name="calendar" size={20} color="#3b82f6" />
                    <TextInput 
                      value={days} 
                      onChangeText={setDays} 
                      keyboardType="numeric" 
                      placeholder="1"
                      placeholderTextColor="#9ca3af"
                      className="flex-1 font-black text-gray-900 text-lg ml-2" 
                    />
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Category Selection Card */}
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
                        <Ionicons name="sparkles" size={20} color="white" />
                    </View>
                        <Text className="text-gray-800 font-bold text-lg ml-3">Trip Vibe</Text>
                    </View>
          
                    <View 
                        style={{
                            flexDirection: 'column',
                            flexWrap: 'wrap',
                            height: 240
                        }}
                    >
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

          {/* Notes Card */}
          <View className="bg-white rounded-3xl p-6 mb-6 shadow-md" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12 }}>
            <View className="flex-row items-center mb-4">
              <View className="bg-orange-50 p-2 rounded-xl mr-3">
                <Ionicons name="document-text" size={20} color="#f97316" />
              </View>
              <Text className="text-gray-400 font-bold uppercase text-xs tracking-widest">Travel Notes</Text>
            </View>

            <View className="bg-gray-50 rounded-2xl overflow-hidden">
              <TextInput 
                value={notes} 
                onChangeText={setNotes} 
                multiline 
                numberOfLines={6}
                textAlignVertical="top"
                placeholder="Add notes about your trip, special requirements, reminders..."
                placeholderTextColor="#9ca3af"
                className="p-4 text-gray-700 min-h-[140px] font-medium leading-6" 
              />
            </View>
          </View>

          {/* Action Buttons */}
          <View className="flex-row mb-6">
            <TouchableOpacity 
              onPress={() => router.back()}
              className="flex-1 bg-white py-5 rounded-2xl mr-2 border-2 border-gray-200"
            >
              <Text className="text-gray-600 text-center font-black text-base">Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={handleUpdate}
              disabled={loading}
              className="flex-1 bg-green-500 py-5 rounded-2xl ml-2 shadow-lg"
              style={{ 
                shadowColor: '#26cc00',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                opacity: loading ? 0.7 : 1
              }}
            >
              <View className="flex-row items-center justify-center">
                {loading && <Ionicons name="sync" size={18} color="white" className="mr-2" />}
                <Text className="text-white text-center font-black text-base ml-2">
                  {loading ? "Updating..." : "Save Changes"}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default EditTrip