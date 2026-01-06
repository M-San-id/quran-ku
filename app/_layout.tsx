import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
          title: "QuranQu",
        }}
      />
      <Stack.Screen
        name="surat/[id]"
        options={{
          title: "Kembali",
        }}
      />
      <Stack.Screen
        name="doa/[id]"
        options={{
          title: "Kembali",
        }}
      />
    </Stack>
  );
}
