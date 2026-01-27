import React, { createContext, useState, ReactNode, useRef, useEffect } from "react"
import { View, Animated, Text } from "react-native"

interface LoaderContextProps {
  showLoader: () => void
  hideLoader: () => void
  isLoading: boolean
}

export const LoaderContext = createContext<LoaderContextProps>({
  showLoader: () => {},
  hideLoader: () => {},
  isLoading: false,
})

const WaveDots = () => {
  const dots = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ]

  useEffect(() => {
    dots.forEach((dot, i) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(dot, {
            toValue: -10,
            duration: 300,
            delay: i * 150,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ])
      ).start()
    })
  }, [])

  return (
    <View style={{ flexDirection: "row" }}>
      {dots.map((dot, i) => (
        <Animated.View
          key={i}
          style={{
            width: 12,
            height: 12,
            borderRadius: 6,
            backgroundColor: "#26cc00",
            transform: [{ translateY: dot }],
            marginHorizontal: 4,
          }}
        />
      ))}
    </View>
  )
}

export const LoaderProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false)

  const showLoader = () => setIsLoading(true)
  const hideLoader = () => setIsLoading(false)

  return (
    <LoaderContext.Provider value={{ showLoader, hideLoader, isLoading }}>
      {children}

      {isLoading && (
        <View className="absolute top-0 left-0 right-0 bottom-0 justify-center items-center bg-black/30">
          <View className="bg-white p-6 rounded-2xl shadow-lg items-center">
            <WaveDots />
            <Text style={{ marginTop: 12, fontSize: 16, fontWeight: "600", color: "#26cc00" }}>
              Loading, please wait...
            </Text>
          </View>
        </View>
      )}
    </LoaderContext.Provider>
  )
}