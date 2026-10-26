import React from "react";
import { Text, View } from "react-native";

import { healthInfo } from "./HealthBadge";
import { inter } from "../theme/typography";
import { themed } from "../theme/themed";

/** Round health score: tinted disc with a coloured ring and the number. */
export default function HealthRing({ health, size = 76, stroke = 6 }) {
  const { color } = healthInfo(health);
  return (
    <View
      style={[
        styles.ring,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: stroke,
          borderColor: color,
          backgroundColor: `${color}1F`,
        },
      ]}
    >
      <Text style={inter(size * 0.29, "800", color)}>{health}</Text>
    </View>
  );
}

const styles = themed(() => ({
  ring: { alignItems: "center", justifyContent: "center" },
}));