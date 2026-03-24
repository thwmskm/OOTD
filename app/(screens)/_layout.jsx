import { StyleSheet, Text, View } from "react-native";
import { Slot, Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="(authentication)" options={{ headerShown: false }} />
      <Stack.Screen name="(attributes)" options={{ headerShown: false }} />
      <Stack.Screen name="EditOOTD" options={{ headerShown: false }} />
    </Stack>
  );
}
const styles = StyleSheet.create({});
