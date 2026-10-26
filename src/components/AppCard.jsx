import React from "react";
import { Pressable, View } from "react-native";

import { palette } from "../theme/colors";
import { shadow } from "../theme/theme";
import { themed } from "../theme/themed";

/** Cream card with a soft cream edge and drop shadow. */
export default function AppCard({
  children,
  style,
  onPress,
  color,
  radius = 20,
  padding = 16,
  disabled,
}) {
  const cardStyle = [
    styles.card,
    { borderRadius: radius, padding, backgroundColor: color || palette.surface },
    style,
  ];

  if (!onPress) return <View style={cardStyle}>{children}</View>;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [cardStyle, pressed && styles.pressed]}
    >
      {children}
    </Pressable>
  );
}

const styles = themed(() => ({
  card: {
    borderWidth: 1.5,
    borderColor: palette.edge,
    ...shadow(3),
  },
  pressed: { opacity: 0.88, transform: [{ scale: 0.99 }] },
}));