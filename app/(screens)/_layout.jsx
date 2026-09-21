import { StyleSheet, Text, View } from "react-native";
import { Slot, Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="(authentication)" options={{ headerShown: false }} />
      <Stack.Screen name="(attributes)" options={{ headerShown: false }} />
      <Stack.Screen name="EditOOTD" options={{ headerShown: false }} />
      <Stack.Screen name="OOTDView" options={{ headerShown: false }} />
      <Stack.Screen name="ChangeUsername" options={{ headerShown: false }} />
      <Stack.Screen name="WeeklyStrip" options={{ headerShown: false }} />
      <Stack.Screen name="EditProfile" options={{ headerShown: false }} />
      <Stack.Screen
        name="(calendar)/CalendarView"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="(settings)/settings"
        options={{ headerShown: false }}
      />
      <Stack.Screen name="(settings)/info" options={{ headerShown: false }} />
    </Stack>
  );
}
const styles = StyleSheet.create({});
