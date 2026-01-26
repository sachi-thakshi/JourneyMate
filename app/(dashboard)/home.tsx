import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';

const Home = () => {
  const router = useRouter()
  const { logout } = useAuth()

  const handleLogout = async () => {
    await logout();
    router.replace("/login"); 
  };

  return (
    <View className="flex-1 bg-blue-900 justify-center items-center px-6">
      <Text className="text-white text-4xl font-bold mb-2">
        Home Page
      </Text>

      <TouchableOpacity
        className="w-full bg-gray-400 py-4 rounded-full shadow-lg mb-4"
        onPress={() => {
          router.push('/login');
        }}
      >
        <Text className="text-white text-xl font-semibold text-center">
          Login
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="w-full bg-red-500 py-4 rounded-full shadow-lg"
        onPress={handleLogout}
      >
        <Text className="text-white text-xl font-semibold text-center">
          Logout
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Home;