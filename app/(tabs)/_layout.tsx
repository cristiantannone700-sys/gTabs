import { Tabs } from 'expo-router';
import { Hop as Home, Library, Music } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#000',
          borderTopColor: '#222',
        },
        tabBarActiveTintColor: '#ef4444',
        tabBarInactiveTintColor: '#888',
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ size, color }) => (
            <Home size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: 'Libreria',
          tabBarIcon: ({ size, color }) => (
            <Library size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="tuner"
        options={{
          title: 'Accordatore',
          tabBarIcon: ({ size, color }) => (
            <Music size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
