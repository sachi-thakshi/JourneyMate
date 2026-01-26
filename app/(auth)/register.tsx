import { useLoader } from "@/hooks/useLoader";
import { registerUser } from "@/lib/authService";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Keyboard,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Image,
} from "react-native";

// - /register
function Register() {
  const router = useRouter();

  const { showLoader, hideLoader, isLoading } = useLoader();

  const [name, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async () => {
    if (isLoading) {
      return;
    }

    if (!name || !email || !password) {
      Alert.alert("Please fill the all fileds...!");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Password do not match ...!");
      return;
    }

    try {
      showLoader();
      await registerUser(name, email, password);
      Alert.alert("Account created...!");
      router.replace("/login");
    } catch (error) {
      console.log("Firebase Error Log:", error);
      Alert.alert("Registration Fail...");
    } finally {
      hideLoader();
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1 bg-white">
        
        <View className="absolute top-0 right-0">
          <Image 
            source={{ uri: 'https://cdn-icons-png.flaticon.com/128/7894/7894141.png' }}
            style={{ width: 180, height: 180, opacity: 0.1, tintColor: '#26cc00' }}
            className="absolute -top-2 -right-1"
            resizeMode="contain"
          />
        </View>

        <View className="absolute bottom-0 left-0">
          <Image 
            source={{ uri: 'https://cdn-icons-png.flaticon.com/128/2147/2147002.png' }}
            style={{ width: 250, height: 250, opacity: 0.08, tintColor: '#26cc00' }}
            className="absolute -bottom-1 -left-1"
            resizeMode="contain"
          />
        </View>

        <View className="flex-1 justify-center items-center px-8 z-10">
          
          {/* Header Section */}
          <View className="w-full mb-10">
            <Text style={{ color: '#26cc00' }} className="text-5xl font-extrabold tracking-tight">
              Join Us
            </Text>
            <View style={{ height: 4, width: 60, backgroundColor: '#26cc00', marginTop: 8, borderRadius: 2 }} />
            <Text className="text-gray-400 text-lg mt-3 font-medium">
              Start your JourneyMate adventure today.
            </Text>
          </View>

          {/* Registration Form */}
          <View className="w-full space-y-4">
            {/* Username */}
            <View className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 shadow-sm">
              <TextInput
                placeholder="Username"
                placeholderTextColor="#9CA3AF"
                value={name}
                onChangeText={setUsername}
                className="text-lg text-gray-800"
              />
            </View>

            {/* Email */}
            <View className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 shadow-sm mt-4">
              <TextInput
                placeholder="Email Address"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                className="text-lg text-gray-800"
              />
            </View>

            {/* Password */}
            <View className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 shadow-sm mt-4">
              <TextInput
                placeholder="Password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                className="text-lg text-gray-800"
              />
            </View>

            {/* Confirm Password */}
            <View className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 shadow-sm mt-4">
              <TextInput
                placeholder="Confirm Password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                className="text-lg text-gray-800"
              />
            </View>
          </View>

          {/* Register Button */}
          <Pressable
            style={{ backgroundColor: '#26cc00' }}
            onPress={handleRegister}
            className="w-full py-4 rounded-2xl shadow-xl mt-10 active:opacity-90"
          >
            <Text className="text-white text-xl font-bold text-center">
              Create Account
            </Text>
          </Pressable>

          {/* Back to Login Footer */}
          <TouchableOpacity 
            className="mt-8" 
            onPress={() => router.back()}
          >
            <Text className="text-gray-500 text-center text-base">
              Already have an account? 
              <Text style={{ color: '#26cc00' }} className="font-bold"> Login</Text>
            </Text>
          </TouchableOpacity>

        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

export default Register;
