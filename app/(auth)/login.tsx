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
      <View className="flex-1 bg-blue-900 justify-center items-center px-6">
        {/* Title */}
        <Text className="text-white text-4xl font-bold mb-2">Welcome Back</Text>

        <Text className="text-white/80 text-lg mb-8">Login to TaskHub</Text>

        {/* Email */}
        <View className="w-full bg-white rounded-2xl px-4 py-3 mb-4">
          <TextInput
            placeholder="Email"
            placeholderTextColor="#9CA3AF"
            value={email}
            onChangeText={setEmail}
            className="text-lg text-gray-800"
          />
        </View>

        {/* Password */}
        <View className="w-full bg-white rounded-2xl px-4 py-3 mb-6">
          <TextInput
            placeholder="Password"
            placeholderTextColor="#9CA3AF"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            className="text-lg text-gray-800"
          />
        </View>

        <Pressable
          className="w-full bg-green-500 py-4 rounded-full shadow-lg mb-4"
          onPress={() => {
            router.replace("/home");
          }}
        >
          <Text className="text-white text-xl font-semibold text-center">
            Login
          </Text>
        </Pressable>

        <TouchableOpacity
          className="w-full bg-purple-800 py-4 rounded-full shadow-lg mb-4"
          onPress={goToRegister}
        >
          <Text className="text-white text-xl font-semibold text-center">
            Register
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Login;
