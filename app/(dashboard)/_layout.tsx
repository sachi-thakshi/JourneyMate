import React from 'react'
import { Tabs } from 'expo-router'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'

const tabs = [
    {name:"home", title:"Home", icon:"home"},
    {name:"tasks", title:"Tabs", icon:"list"},
    {name:"news", title:"News", icon:"article"},
    {name:"profile", title:"Profile", icon:"person"}
] as const
const DashBoardLayout = () => {
    return (
        <Tabs 
            screenOptions={{
                headerShown:false
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