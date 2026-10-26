import React from "react";
import { Pressable, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { palette, tealA } from "../theme/colors";
import { inter } from "../theme/typography";
import { themed } from "../theme/themed";

/** - value + stepper used in the shop and cart. */
export default function QuantityStepper({ value, onMinus, onPlus, size = 34 }) {
  const btn = (icon, onPress) => (
    <Pressable
      onPress={onPress}
      hitSlop={6}
      style={({ pressed }) => [
        styles.btn,
        { width: size, height: size, borderRadius: size * 0.3 },
        pressed && { opacity: 0.7 },
      ]}
    >
      <MaterialCommunityIcons name={icon} size={18} color={palette.accent} />
    </Pressable>
  );

  return (
    <View style={styles.row}>
      {btn("minus", onMinus)}
      <Text style={[inter(16, "800", palette.textDark), styles.value]}>{value}</Text>
      {btn("plus", onPlus)}
    </View>
  );
}

const styles = themed(() => ({
  row: { flexDirection: "row", alignItems: "center" },
  btn: {
    backgroundColor: tealA(0.1),
    alignItems: "center",
    justifyContent: "center",
  },
  value: { minWidth: 34, textAlign: "center" },
}));