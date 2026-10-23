import React from "react";
import { Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import { palette } from "../theme/colors";
import { shadow } from "../theme/theme";
import { themed } from "../theme/themed";

/** Cream circle with a teal arrow. Goes back, or to Home if there is nowhere to go. */
export default function BackButton({ onPress, style, size = 42 }) {
  const navigation = useNavigation();

  const handlePress =
    onPress ||
    (() => {
      if (navigation.canGoBack()) navigation.goBack();
      else navigation.navigate("MainTabs", { screen: "Home" });
    });

  return (
    <Pressable
      onPress={handlePress}
      hitSlop={8}
      style={({ pressed }) => [
        styles.circle,
        { width: size, height: size, borderRadius: size / 2 },
        pressed && { opacity: 0.8 },
        style,
      ]}
    >
      <MaterialCommunityIcons name="arrow-left" size={24} color={palette.accent} />
    </Pressable>
  );
}

const styles = themed(() => ({
  circle: {
    backgroundColor: palette.surface,
    borderWidth: 2,
    borderColor: palette.accent,
    alignItems: "center",
    justifyContent: "center",
    ...shadow(4),
  },
}));