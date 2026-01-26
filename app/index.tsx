import { useState } from "react"
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView, ActivityIndicator } from "react-native"
import "../global.css"
import { Redirect } from "expo-router"
import { useAuth } from "@/hooks/useAuth"


const Index = () => {
    const { user , loading } = useAuth()

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size={"large"} color={"#4ade80"}/>
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