import { useLoader } from "@/hooks/useLoader";
import { registerUser } from "@/lib/authService";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

function Register() {
  const router = useRouter()
  const { showLoader, hideLoader, isLoading } = useLoader()

  const [name, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleRegister = async () => {
    if (isLoading) return;

    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Missing Info", "Please fill in all fields to join us.")
      return
    }

    if (password !== confirmPassword) {
      Alert.alert("Mismatch", "Passwords do not match. Please check again.")
      return
    }

    try {
      showLoader();
      await registerUser(name, email, password)
      Alert.alert("Success", "Account created successfully!")
      router.replace("/login")
    } catch (error) {
      console.log("Firebase Error Log:", error)
      Alert.alert("Error", "Registration failed. Try a different email.")
    } finally {
      hideLoader()
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1 bg-white">
        
        <View 
          className="absolute -top-10 -right-10 w-72 h-72 rounded-full" 
          style={{ backgroundColor: '#26cc00', opacity: 0.05 }} 
        />
        <View 
          className="absolute bottom-20 -left-20 w-60 h-60 rounded-full" 
          style={{ backgroundColor: '#26cc00', opacity: 0.03 }} 
        />

        <View className="flex-1 px-8 justify-center mt-10">
          
          {/* Header Section */}
          <View className="mb-10">
            <TouchableOpacity 
              onPress={() => router.back()}
              className="bg-gray-50 w-12 h-12 rounded-2xl items-center justify-center mb-6 border border-gray-100"
            >
              <Ionicons name="chevron-back" size={24} color="#26cc00" />
            </TouchableOpacity>
            
            <Text className="text-gray-900 text-5xl font-black tracking-tighter">
              Join <Text style={{ color: '#26cc00' }}>Us</Text>
            </Text>
            <Text className="text-gray-400 text-lg font-medium mt-2">
              Start your JourneyMate adventure.
            </Text>
          </View>

          {/* Registration Form */}
          <View className="space-y-4">
            {/* Username */}
            <View className="bg-gray-50 border border-gray-100 rounded-[25px] px-6 py-4 flex-row items-center shadow-sm">
              <Ionicons name="person-outline" size={20} color="#9ca3af" />
              <TextInput
                placeholder="Username"
                placeholderTextColor="#9CA3AF"
                value={name}
                onChangeText={setUsername}
                className="flex-1 text-gray-800 font-bold text-base ml-4"
              />
            </View>

            {/* Email */}
            <View className="bg-gray-50 border border-gray-100 rounded-[25px] px-6 py-4 flex-row items-center shadow-sm mt-4">
              <Ionicons name="mail-outline" size={20} color="#9ca3af" />
              <TextInput
                placeholder="Email Address"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                className="flex-1 text-gray-800 font-bold text-base ml-4"
              />
            </View>

            {/* Password */}
            <View className="bg-gray-50 border border-gray-100 rounded-[25px] px-6 py-4 flex-row items-center shadow-sm mt-4">
              <Ionicons name="lock-closed-outline" size={20} color="#9ca3af" />
              <TextInput
                placeholder="Password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                className="flex-1 text-gray-800 font-bold text-base ml-4"
              />
            </View>

            {/* Confirm Password */}
            <View className="bg-gray-50 border border-gray-100 rounded-[25px] px-6 py-4 flex-row items-center shadow-sm mt-4">
              <Ionicons name="shield-checkmark-outline" size={20} color="#9ca3af" />
              <TextInput
                placeholder="Confirm Password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                className="flex-1 text-gray-800 font-bold text-base ml-4"
              />
            </View>
          </View>

          {/* Register Button */}
          <TouchableOpacity 
            onPress={handleRegister}
            disabled={isLoading}
            className="mt-10 rounded-[25px] overflow-hidden shadow-xl shadow-green-500/40"
            style={{ elevation: 8 }}
          >
            <LinearGradient
              colors={['#26cc00', '#1b9400']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="py-5 items-center justify-center flex-row"
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Text className="text-white text-xl font-black mr-2">Create Account</Text>
                  <Ionicons name="person-add-outline" size={20} color="white" />
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* Back to Login Footer */}
          <TouchableOpacity 
            className="mt-8 items-center" 
            onPress={() => router.back()}
          >
            <Text className="text-gray-500 text-base">
              Already have an account? 
              <Text className="text-[#26cc00] font-black"> Login</Text>
            </Text>
          </TouchableOpacity>

        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}

export default Register