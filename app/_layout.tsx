import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import { View } from "react-native";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: true,
          title: "QuranQu",
          headerLeft: () => (
            <View>
              <View style={{ width: 35 }} />
              <Ionicons name="book" size={24} color={"#00a88cff"} />
            </View>
          ),
        }}
      />
      <Stack.Screen
        name="surat/[id]"
        options={{
          title: "Kembali",
        }}
      />
    </Stack>
  );
}
