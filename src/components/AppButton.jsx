import React from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { palette, creamA } from "../theme/colors";
import { inter } from "../theme/typography";
import { shadow } from "../theme/theme";
import { themed } from "../theme/themed";

const getVariants = () => ({
  // deep teal fill, cream text, cream edge
  green: {
    bg: palette.teal,
    fg: palette.cream,
    border: { borderWidth: 1.5, borderColor: creamA(0.6) },
  },
  // warm tan fill, dark text
  orange: { bg: palette.buttonOrange, fg: "#1A1A1A", border: null },
  // soft light-green fill, dark text
  secondary: { bg: palette.greenCardFill, fg: palette.textDark, border: null },
  // cream fill, teal border + text
  outline: {
    bg: palette.surface,
    fg: palette.accent,
    border: { borderWidth: 2, borderColor: palette.accent },
  },
  // cream fill, red border + text
  danger: {
    bg: palette.surface,
    fg: palette.danger,
    border: { borderWidth: 2, borderColor: palette.danger },
  },
});

export default function AppButton({
  label,
  onPress,
  variant = "green",
  leftIcon,
  rightIcon,
  loading = false,
  disabled = false,
  style,
  textStyle,
}) {
  const variants = getVariants();
  const v = variants[variant] || variants.green;
  const off = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={off}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: v.bg },
        v.border,
        off && styles.disabled,
        pressed && styles.pressed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={v.fg} />
      ) : (
        <View style={styles.row}>
          {leftIcon ? (
            <MaterialCommunityIcons name={leftIcon} size={20} color={v.fg} style={styles.iconL} />
          ) : null}
          <Text style={[inter(15, "700", v.fg), styles.label, textStyle]} numberOfLines={2}>
            {label}
          </Text>
          {rightIcon ? (
            <MaterialCommunityIcons name={rightIcon} size={20} color={v.fg} style={styles.iconR} />
          ) : null}
        </View>
      )}
    </Pressable>
  );
}

const styles = themed(() => ({
  base: {
    minHeight: 52,
    borderRadius: 20,
    paddingHorizontal: 22,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    ...shadow(3, 0.3),
  },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "center" },
  label: { textAlign: "center", flexShrink: 1 },
  iconL: { marginRight: 8 },
  iconR: { marginLeft: 8 },
  disabled: { opacity: 0.6 },
  pressed: { opacity: 0.9, transform: [{ scale: 0.98 }] },
}));