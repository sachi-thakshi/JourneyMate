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
  View
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
      <View className="flex-1 bg-blue-900 justify-center items-center px-6">
        {/* Title */}
        <Text className="text-white text-4xl font-bold mb-2">
          Create Account
        </Text>

        <Text className="text-white/80 text-lg mb-8">Join TaskHub today</Text>

        {/* Username */}
        <View className="w-full bg-white rounded-2xl px-4 py-3 mb-4">
          <TextInput
            placeholder="Username"
            placeholderTextColor="#9CA3AF"
            value={name}
            onChangeText={setUsername}
            className="text-lg text-gray-800"
          />
        </View>

        {/* Email */}
        <View className="w-full bg-white rounded-2xl px-4 py-3 mb-4">
          <TextInput
            placeholder="Email"
            placeholderTextColor="#9CA3AF"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            className="text-lg text-gray-800"
          />
        </View>

        {/* Password */}
        <View className="w-full bg-white rounded-2xl px-4 py-3 mb-4">
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
        <View className="w-full bg-white rounded-2xl px-4 py-3 mb-6">
          <TextInput
            placeholder="Confirm Password"
            placeholderTextColor="#9CA3AF"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            className="text-lg text-gray-800"
          />
        </View>

        {/* Register Button */}
        <TouchableOpacity
          onPress={handleRegister}
          className="w-full bg-green-500 py-4 rounded-full shadow-lg mb-4"
        >
          <Text className="text-white text-xl font-semibold text-center">
            Register
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="w-full bg-purple-800 py-4 rounded-full shadow-lg mb-4"
          onPress={() => {
            router.back();
          }}
        >
          <Text className="text-white text-xl font-semibold text-center">
            Login
          </Text>
        </TouchableOpacity>
        {/* Footer */}
        <Text className="text-white/80 mt-2">
          Already have an account? Login
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
}

export default Register;
