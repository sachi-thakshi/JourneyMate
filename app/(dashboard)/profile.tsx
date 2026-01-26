import { View, Text, TouchableOpacity, Image, TextInput, ScrollView, Alert, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import { updateUserProfile } from "@/lib/authService"; 
import { uploadToCloudinary } from '@/lib/cloudinary';
import { useRouter } from 'expo-router';

const Profile = () => {
  const router = useRouter()
  const { logout, user } = useAuth()
  
  const [name, setName] = useState(user?.displayName || "");
  const [image, setImage] = useState(user?.photoURL || null);
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    await logout()
    router.replace("/login")
  }
  
  useEffect(() => {
    if (user) {
      setName(user.displayName || "");
      setImage(user.photoURL || null);
    }
  }, [user]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Gallery access is needed to change photos.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleUpdateProfile = async () => {
    if (!user?.uid) return;

    setLoading(true);
    try {
      let finalPhotoUrl = image;

      if (image && image.startsWith('file')) {
        finalPhotoUrl = await uploadToCloudinary(image);
      }

      await updateUserProfile(user.uid, name, finalPhotoUrl || "");
      
      Alert.alert("Success", "Profile updated successfully!");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView className="flex-1 bg-white" showsVerticalScrollIndicator={false}>
      {/* Header Section */}
      <View style={{ backgroundColor: '#26cc00' }} className="h-44 w-full items-center justify-center pt-8">
        <Text className="text-white text-2xl font-bold tracking-widest">SETTINGS</Text>
      </View>

      {/* Profile Picture Section */}
      <View className="items-center -mt-12">
        <View className="bg-white p-1 rounded-full shadow-2xl">
          <Image
            source={{ uri: image || 'https://cdn-icons-png.flaticon.com/512/1144/1144760.png' }}
            className="w-32 h-32 rounded-full border-2 border-gray-50"
          />
          <TouchableOpacity 
            onPress={pickImage}
            style={{ backgroundColor: '#26cc00' }}
            className="absolute bottom-1 right-1 p-2.5 rounded-full border-4 border-white shadow-md"
          >
            <Ionicons name="camera" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <View className="px-8 mt-10 space-y-6">
        {/* Email Field (Read Only) */}
        <View className="mb-4">
          <Text className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Registered Email</Text>
          <View className="flex-row items-center border-b border-gray-100 pb-2">
            <Ionicons name="mail-outline" size={20} color="#9CA3AF" />
            <Text className="flex-1 ml-3 text-lg text-gray-400 font-medium">
              {user?.email}
            </Text>
            <Ionicons name="lock-closed-outline" size={16} color="#D1D5DB" />
          </View>
        </View>

        {/* Display Name Field (Editable) */}
        <View className="mb-8">
          <Text className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Display Name</Text>
          <View className="flex-row items-center border-b border-gray-100 pb-2">
            <Ionicons name="person-outline" size={20} color="#26cc00" />
            <TextInput
              value={name}
              onChangeText={setName}
              className="flex-1 ml-3 text-lg text-gray-800 font-semibold"
              placeholder="Your travel name"
              autoCapitalize="words"
            />
          </View>
        </View>

        {/* Action Buttons */}
        <View className="mt-4 space-y-4">
          <TouchableOpacity 
            style={{ backgroundColor: loading ? '#a3e635' : '#26cc00' }}
            className="w-full py-4 rounded-2xl shadow-lg items-center"
            onPress={handleUpdateProfile}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-lg font-bold">Save Changes</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={handleLogout} 
            className="w-full py-4 rounded-2xl border border-red-100 items-center mt-2 flex-row justify-center"
          >
            <Ionicons name="log-out-outline" size={20} color="#EF4444" />
            <Text className="text-red-500 text-lg font-bold ml-2">Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default Profile;