import React, { useRef } from "react";
import { View } from "react-native";
import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";

import { AuthProvider } from "./src/context/AuthContext";
import { PlantProvider } from "./src/context/PlantContext";
import { CartProvider } from "./src/context/CartContext";
import { WishlistProvider } from "./src/context/WishlistContext";
import { ThemeProvider, useTheme } from "./src/context/ThemeContext";

import StackNavigator from "./src/navigation/StackNavigator";
import GradientBackground from "./src/components/GradientBackground";
import { fontAssets } from "./src/theme/typography";
import { palette } from "./src/theme/colors";

function ThemedNavigation() {
  const { mode, isDark, ready } = useTheme();

  // Remember where the user is, so switching theme (which remounts the
  // navigator to rebuild every style) keeps them on the same screen.
  const navState = useRef(undefined);

  if (!ready) {
    return (
      <View style={{ flex: 1 }}>
        <GradientBackground decor={false} />
      </View>
    );
  }

  const base = isDark ? DarkTheme : DefaultTheme;
  const navTheme = {
    ...base,
    colors: {
      ...base.colors,
      primary: palette.teal,
      background: palette.tabBar,
      card: palette.tabBar,
      text: palette.cream,
      border: "transparent",
    },
  };

  return (
    <NavigationContainer
      key={mode}
      theme={navTheme}
      initialState={navState.current}
      onStateChange={(state) => {
        navState.current = state;
      }}
    >
      <StatusBar style={isDark ? "light" : "dark"} />
      <StackNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  const [fontsLoaded, fontError] = useFonts(fontAssets);

  if (!fontsLoaded && !fontError) {
    return (
      <View style={{ flex: 1 }}>
        <GradientBackground decor={false} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <PlantProvider>
            <CartProvider>
              <WishlistProvider>
                <ThemedNavigation />
              </WishlistProvider>
            </CartProvider>
          </PlantProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}