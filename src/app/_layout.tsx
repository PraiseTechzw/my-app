import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { HabitProvider } from "../data/habits";
import { colors } from "../theme";

export default function RootLayout() {
  return (
    <HabitProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.canvas },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="add-habit" options={{ presentation: "modal" }} />
        <Stack.Screen name="habit/[id]" />
        <Stack.Screen name="success" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="goals" />
        <Stack.Screen name="info" />
      </Stack>
    </HabitProvider>
  );
}
