import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { BeersProvider } from "../src/context/BeersContext";
import { colors } from "../src/constants/theme";

export default function RootLayout() {
  return (
    <BeersProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen
          name="form"
          options={{
            presentation: "modal",
            animation: "slide_from_bottom",
          }}
        />
      </Stack>
    </BeersProvider>
  );
}
