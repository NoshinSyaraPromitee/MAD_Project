import React from "react";
import { Text, View } from "react-native";

import RiveMascot from "./RiveMascot";
import { palette } from "../theme/colors";
import { inter } from "../theme/typography";
import { shadow } from "../theme/theme";
import { themed } from "../theme/themed";

// Animated mascot (totoro.riv) with an optional speech bubble.
export default function PlantBuddy({ message, size = 160 }) {
  return (
    <View style={styles.wrapper}>
      {message ? (
        <View style={styles.bubble}>
          <Text style={[inter(14, "700", palette.textDark), styles.center]}>{message}</Text>
          <View style={styles.tail} />
        </View>
      ) : null}
      <RiveMascot width={size} />
    </View>
  );
}

const styles = themed(() => ({
  wrapper: { alignItems: "center", marginBottom: 10 },
  center: { textAlign: "center" },
  bubble: {
    backgroundColor: palette.surface,
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 18,
    maxWidth: 260,
    marginBottom: 10,
    ...shadow(4),
  },
  tail: {
    position: "absolute",
    bottom: -9,
    left: "50%",
    marginLeft: -8,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 10,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: palette.surface,
  },
}));