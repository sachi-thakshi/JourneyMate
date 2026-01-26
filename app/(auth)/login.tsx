import { useLoader } from "@/hooks/useLoader";
import { login } from "@/lib/authService";
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

// - /login
const Login = () => {
  const router = useRouter();

  const { showLoader, hideLoader, isLoading } = useLoader();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password || isLoading) {
      Alert.alert("Please fill the all fileds...!");
      return;
    }

    try {
      showLoader();
      await login(email, password);
      router.replace("/home");
    } catch (error) {
      console.error(error);
      Alert.alert("Login Fail...");
    } finally {
      hideLoader();
    }
  };

  const goToRegister = () => {
    router.push("/register");
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1 bg-white">
        
        {/* Top-Right Decorative Shape */}
        <View className="absolute top-0 right-0">
          <Image 
            source={{ uri: 'https://cdn-icons-png.flaticon.com/128/7894/7894141.png' }}
            style={{ width: 180, height: 180, opacity: 0.1, tintColor: '#26cc00' }}
            className="absolute -top-2 -right-1"
            resizeMode="contain"
          />
        </View>

        {/* Bottom-Left Decorative Shape */}
        <View className="absolute bottom-0 left-0">
          <Image 
            source={{ uri: 'https://cdn-icons-png.flaticon.com/128/2147/2147002.png' }}
            style={{ width: 250, height: 250, opacity: 0.08, tintColor: '#26cc00' }}
            className="absolute -bottom-1 -left-1"
            resizeMode="contain"
          />
        </View>

        <View className="flex-1 justify-center items-center px-8 z-10">
          
          {/* Branding Section */}
          <View className="w-full mb-12">
            <Text style={{ color: '#26cc00' }} className="text-5xl font-extrabold tracking-tight">
              JourneyMate
            </Text>
            <View style={{ height: 4, width: 60, backgroundColor: '#26cc00', marginTop: 8, borderRadius: 2 }} />
            <Text className="text-gray-400 text-lg mt-3 font-medium">
              Your journey, perfectly organized.
            </Text>
          </View>

          {/* Input Fields */}
          <View className="w-full space-y-4">
            <View className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 shadow-sm">
              <TextInput
                placeholder="Email Address"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                className="text-lg text-gray-800"
              />
            </View>

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
          </View>

          {/* Action Button */}
          <Pressable
            style={{ backgroundColor: '#26cc00' }}
            className="w-full py-4 rounded-2xl shadow-xl mt-10 active:opacity-90"
            onPress={handleLogin}
          >
            <Text className="text-white text-xl font-bold text-center">
              Start Exploring
            </Text>
          </Pressable>

          {/* Footer */}
          <TouchableOpacity className="mt-8" onPress={goToRegister}>
            <Text className="text-gray-500 text-center text-base">
              Don't have an account? 
              <Text style={{ color: '#26cc00' }} className="font-bold"> Sign Up</Text>
            </Text>
          </TouchableOpacity>

        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}

export default Login;
