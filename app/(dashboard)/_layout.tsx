import React from 'react'
import { Tabs } from 'expo-router'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'

const tabs = [
    { name: "home", title: "Home", icon: "home" },   
    { name: "explore", title: "Explore", icon: "map" },
    { name: "journeys", title: "My Journeys", icon: "luggage" }, 
    { name: "budget", title: "Budget", icon: "payments" }, 
    { name: "profile", title: "Profile", icon: "person" },
] as const
const DashBoardLayout = () => {
    return (
        <Tabs 
            screenOptions={{
                headerShown:false,
                tabBarActiveTintColor: '#26cc00',
                tabBarInactiveTintColor: '#9CA3AF',
                tabBarStyle: {
                    borderTopWidth: 1,
                    borderTopColor: '#F3F4F6',
                },
            }}
        >
            {
                tabs.map(({ name, title, icon}: any) =>(
                    <Tabs.Screen
                        name={name}
                        options={{
                            title:title,
                            tabBarIcon: ({color , size}) => (
                                <MaterialIcons 
                                        name={icon}
                                        color={color}
                                        size={size}
                                />
                            )
                        }}
                    />
                ))
            }
        </Tabs>
    )      
}

export default DashBoardLayout