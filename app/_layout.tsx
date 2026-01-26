import { AuthProvider } from '@/context/AuthContext'
import { LoaderProvider } from '@/context/LoaderContext'
import { Slot } from 'expo-router'
import React from 'react'
import { View } from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'

const RootLayout = () => {
  const insets = useSafeAreaInsets()  
  console.log(insets)

  return (
    <LoaderProvider>
      <AuthProvider>
          <View className="flex-1" style={{ marginTop: insets.top}}>
            <Slot/> 
      </View>
      </AuthProvider>
      
    </LoaderProvider> 
  )
}

export default RootLayout
