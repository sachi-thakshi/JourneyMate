import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ 
      tabBarActiveTintColor: '#26cc00', 
      headerShown: false,
      tabBarStyle: { 
        height: 65, 
        paddingBottom: 100, 
        paddingTop: 10 
      }
    }}>
      {/* Main Visible Tabs */}
      <Tabs.Screen name="home" options={{ title: 'Home', 
        tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} /> }} />
      
      <Tabs.Screen name="explore" options={{ title: 'Explore', 
        tabBarIcon: ({ color }) => <Ionicons name="search" size={24} color={color} /> }} />

      <Tabs.Screen name="journeys" options={{ title: 'Trips', 
        tabBarIcon: ({ color }) => <Ionicons name="airplane" size={24} color={color} /> }} />

      <Tabs.Screen name="budget" options={{ title: 'Budget', 
        tabBarIcon: ({ color }) => <Ionicons name="wallet" size={24} color={color} /> }} />

      <Tabs.Screen name="profile" options={{ title: 'Profile', 
        tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} /> }} />

      {/* Hidden from Bar but keeping Nav Bar visible on the page */}
      <Tabs.Screen name="create-trip" options={{ href: null }} />
      <Tabs.Screen name="community" options={{ href: null }} />
      <Tabs.Screen name="checklist" options={{ href: null }} />
      <Tabs.Screen name="expenses" options={{ href: null }} />
      <Tabs.Screen name="trip-details" options={{ href: null }} />
      <Tabs.Screen name="edit-trip" options={{ href: null }} />
    </Tabs>
  );
}