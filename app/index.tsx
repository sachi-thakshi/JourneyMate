import { useState } from "react"
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView, ActivityIndicator } from "react-native"
import "../global.css"
import { Redirect, useRouter } from "expo-router"
import { useAuth } from "@/hooks/useAuth"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"


const Index = () => {
    const { user , loading } = useAuth()
    const router = useRouter()

   if (loading) {
        return (
            <View className="flex-1 bg-white justify-center items-center">
                <ActivityIndicator size="large" color="#26cc00" />
                <Text style={{ color: '#26cc00' }} className="text-xl font-bold mt-4 tracking-widest">
                    JOURNEYMATE
                </Text>
            </View>
        )
    }
    if (user) {
        return <Redirect href={"/home"}/>
    }

    return (
        <View className="flex-1 bg-white">
            {/* Top Image Section */}
            <View className="flex-[0.6] relative">
                <Image 
                    source={{ uri: 'https://images.unsplash.com/photo-1554481923-a6918bd997bc?q=80&w=765&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' }} 
                    className="w-full h-full"
                    resizeMode="cover"
                />
            </View>

            {/* Bottom Content Section */}
            <View 
            className="flex-[0.4] px-10 items-center justify-center -mt-10 bg-white rounded-t-[50px] shadow-lg"
            >
            <Text className="text-gray-900 text-4xl font-black text-center">
                Journey<Text className="text-[#26cc00]">Mate</Text>
            </Text>

            <Text className="text-gray-500 text-center text-lg mt-3 font-medium leading-6">
                The smartest way to plan your next adventure and manage your travel budget.
            </Text>

            {/* Get Started Button */}
            <TouchableOpacity 
                onPress={() => router.push("/login")}
                activeOpacity={0.8}
                className="bg-[#26cc00] w-full py-5 rounded-3xl mt-10 flex-row justify-center items-center shadow-xl shadow-green-600/30"
            >
                <Text className="text-white text-xl font-black mr-2">Get Started</Text>
                <Ionicons name="arrow-forward" size={20} color="white" />
            </TouchableOpacity>

            <Text className="text-gray-300 text-[10px] font-black uppercase tracking-widest mt-2">
                Your Personal Travel Assistant
            </Text>
        </View>
        </View>
    )
}

export default Index