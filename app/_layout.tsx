import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerTitle: "Quran" }} />
      <Stack.Screen name="surat/[id]" options={{ headerTitle: "Kembali" }} />
    </Stack>
  );
}
