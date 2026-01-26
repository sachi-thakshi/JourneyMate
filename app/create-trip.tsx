import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const CreateTrip = () => {
  const router = useRouter();
  const [tripName, setTripName] = useState("");

  return (
    <View className="flex-1 bg-white">
      <View className="pt-16 px-6 pb-4 flex-row items-center">
        <TouchableOpacity 
          onPress={() => router.back()} 
          className="p-3 bg-gray-100 rounded-full"
        >
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        
        <Text className="text-2xl font-bold ml-4">Plan New Trip</Text>
      </View>

      <ScrollView className="flex-1 px-6 pt-4">
        <View className="mb-6">
          <Text className="text-gray-400 font-bold uppercase text-xs tracking-widest mb-2">
            Where are you going?
          </Text>
          <TextInput
            placeholder="e.g. Paris, France"
            value={tripName}
            onChangeText={setTripName}
            className="text-xl py-3 border-b border-gray-200"
            style={{ borderBottomColor: '#26cc00' }} 
          />
        </View>

      </ScrollView>

      <View className="p-12 border-t border-gray-100">
        <TouchableOpacity 
          style={{ backgroundColor: '#26cc00' }}
          className="py-4 rounded-2xl shadow-lg active:opacity-90"
          onPress={() => {
            router.back();
          }}
        >
          <Text className="text-white text-center text-xl font-bold">Create Journey</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CreateTrip;