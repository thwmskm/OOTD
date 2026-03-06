import { Stack } from "expo-router";

function ClosetStack() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="[id]"
        options={{
          headerShown: false,
          tabBarStyle: { display: "none" }, // hides bottom tabs
        }}
      />
    </Stack>
  );
}

export default ClosetStack;
