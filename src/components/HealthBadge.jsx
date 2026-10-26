import React from "react";
import { Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { healthColors } from "../theme/colors";
import { inter } from "../theme/typography";
import { BULLET } from "../utils/format";
import { themed } from "../theme/themed";

export function healthInfo(health) {
  if (health < 60) return { color: healthColors.critical, text: "Critical" };
  if (health < 85) return { color: healthColors.needsCare, text: "Needs Care" };
  return { color: healthColors.thriving, text: "Healthy" };
}

export default function HealthBadge({ health, style }) {
  const { color, text } = healthInfo(health);

  return (
    <View style={[styles.badge, { backgroundColor: `${color}22`, borderColor: `${color}55` }, style]}>
      <MaterialCommunityIcons name="heart-pulse" size={14} color={color} />
      <Text style={[inter(12, "700", color), styles.text]}>
        {health}% {BULLET} {text}
      </Text>
    </View>
  );
}

const styles = themed(() => ({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
  },
  text: { marginLeft: 5 },
}));