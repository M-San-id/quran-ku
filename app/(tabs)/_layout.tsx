import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#00a88cff",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Beranda",
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={24} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="hadist"
        options={{
          title: "Hadist",
          tabBarIcon: ({ color }) => (
            <Ionicons name="book" size={24} color={color} />
          ),
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
