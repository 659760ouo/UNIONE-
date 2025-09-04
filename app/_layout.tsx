
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Define all routes (match Expo Router path names) */}
      <Stack.Screen name="Onboarding" /> {/* Matches app/Onboarding.jsx */}
      <Stack.Screen name="Login" />     {/* Matches app/Login.jsx */}
      <Stack.Screen name="Home" />      {/* Matches app/Home.jsx */}
      <Stack.Screen name="Task" />      {/* Matches app/Task.jsx */}
      <Stack.Screen name="Study" />     {/* Matches app/Study.tsx */}
    </Stack>
  );
}