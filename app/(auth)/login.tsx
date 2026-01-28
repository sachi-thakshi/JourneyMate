import { useLoader } from "@/hooks/useLoader";
import { login } from "@/lib/authService";
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
  Dimensions,
} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window')

const Login = () => {
  const router = useRouter()
  const { showLoader, hideLoader, isLoading } = useLoader()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async () => {
    if (!email || !password || isLoading) {
      Alert.alert("Error", "Please fill in all fields")
      return
    }

    try {
      showLoader()
      await login(email, password)
      router.replace("/home")
    } catch (error) {
      Alert.alert("Login Failed", "Invalid email or password")
    } finally {
      hideLoader()
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1 bg-white">
        
        <View 
          className="absolute -top-20 -left-20 w-80 h-80 rounded-full" 
          style={{ backgroundColor: '#26cc00', opacity: 0.05 }} 
        />
        <View 
          className="absolute top-40 -right-20 w-60 h-60 rounded-full" 
          style={{ backgroundColor: '#26cc00', opacity: 0.03 }} 
        />

        <View className="flex-1 px-8 justify-center">
          
          {/* Header Section */}
          <View className="mb-12">
            <View className="bg-green-100 w-16 h-16 rounded-3xl items-center justify-center mb-6 shadow-sm">
              <Ionicons name="airplane" size={32} color="#26cc00" />
            </View>
            <Text className="text-gray-900 text-5xl font-black tracking-tighter">
              Journey<Text style={{ color: '#26cc00' }}>Mate</Text>
            </Text>
            <Text className="text-gray-400 text-lg font-medium mt-2">
              Sign in to explore your adventures.
            </Text>
          </View>

          {/* Input Group */}
          <View className="space-y-5">
            {/* Email Input */}
            <View className="bg-gray-50 border border-gray-100 rounded-[25px] px-6 py-5 flex-row items-center shadow-sm">
              <Ionicons name="mail-outline" size={20} color="#9ca3af" className="mr-4" />
              <TextInput
                placeholder="Email Address"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                className="flex-1 text-gray-800 font-bold text-base ml-3"
              />
            </View>

            {/* Password Input */}
            <View className="bg-gray-50 border border-gray-100 rounded-[25px] px-6 py-5 flex-row items-center shadow-sm mt-4">
              <Ionicons name="lock-closed-outline" size={20} color="#9ca3af" className="mr-4" />
              <TextInput
                placeholder="Password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                className="flex-1 text-gray-800 font-bold text-base ml-3"
              />
            </View>
          </View>

          {/* Login Button */}
          <TouchableOpacity 
            onPress={handleLogin}
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
              <Text className="text-white text-xl font-black mr-2">
                {isLoading ? "Signing in..." : "Start Exploring"}
              </Text>
              {!isLoading && <Ionicons name="arrow-forward" size={20} color="white" />}
            </LinearGradient>
          </TouchableOpacity>

          {/* Social Divider */}
          <View className="flex-row items-center my-10">
            <View className="flex-1 h-[1px] bg-gray-100" />
            <Text className="mx-4 text-gray-300 font-bold text-xs uppercase tracking-widest">or</Text>
            <View className="flex-1 h-[1px] bg-gray-100" />
          </View>

          {/* Footer */}
          <TouchableOpacity 
            onPress={() => router.push("/register")}
            className="items-center"
          >
            <Text className="text-gray-500 text-base">
              New to the journey? 
              <Text className="text-[#26cc00] font-black"> Create Account</Text>
            </Text>
          </TouchableOpacity>

        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}

export default Login