import { useState } from "react"
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView, ActivityIndicator } from "react-native"
import "../global.css"
import { Redirect } from "expo-router"
import { useAuth } from "@/hooks/useAuth"


const Index = () => {
    const { user , loading } = useAuth()

    if (loading) {
        return (
            <View className="flex-1 bg-white justify-center items-center">
            <View className="items-center justify-center">
                <View 
                style={{ backgroundColor: '#26cc00', opacity: 0.1 }} 
                className="absolute w-24 h-24 rounded-full" 
                />
                <ActivityIndicator size="large" color="#26cc00" />
            </View>

            <View className="mt-6 items-center">
                <Text style={{ color: '#26cc00' }} className="text-xl font-bold tracking-widest">
                JOURNEYMATE
                </Text>
                <Text className="text-gray-400 text-sm mt-1 font-medium italic">
                Preparing your next adventure...
                </Text>
            </View>
            </View>
        )
    }

    if (user) {
        return <Redirect href={"/home"}/>
        
    } else {
        return <Redirect href={"/login"}/>
    }

    // return <Redirect href={"/login"}></Redirect>
}

export default Index