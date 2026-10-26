import React from "react";
import { Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import AppButton from "./AppButton";
import { palette } from "../theme/colors";
import { inter } from "../theme/typography";
import { themed } from "../theme/themed";

/** Icon + title + subtitle + optional action, centred on the gradient. */
export default function EmptyView({ icon, title, subtitle, actionLabel, onAction, style, light = false }) {
  const color = light ? palette.cream : palette.emptyInk;
  return (
    <View style={[styles.wrap, style]}>
      <MaterialCommunityIcons name={icon} size={72} color={light ? palette.cream : palette.emptyIcon} />
      <Text style={[inter(18, "700", color), styles.center, styles.title]}>{title}</Text>
      {subtitle ? <Text style={[inter(14, "500", color), styles.center]}>{subtitle}</Text> : null}
      {actionLabel ? (
        <AppButton label={actionLabel} onPress={onAction} style={styles.button} />
      ) : null}
    </View>
  );
}

const styles = themed(() => ({
  wrap: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  center: { textAlign: "center" },
  title: { marginTop: 12, marginBottom: 6 },
  button: { marginTop: 18, alignSelf: "stretch" },
}));