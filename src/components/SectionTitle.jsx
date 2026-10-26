import React from "react";
import { Text, View } from "react-native";

import { palette } from "../theme/colors";
import { inter } from "../theme/typography";
import { themed } from "../theme/themed";

/**
 * Section label. On the gradient it is cream; pass onCard for the teal
 * version used inside cream sheets.
 */
export default function SectionTitle({ title, right, onCard = false, upper = false, style }) {
  return (
    <View style={[styles.row, style]}>
      <Text
        style={[
          inter(17, "700", onCard ? palette.accent : palette.cream),
          upper && styles.upper,
          styles.flex,
        ]}
      >
        {upper ? String(title).toUpperCase() : title}
      </Text>
      {right}
    </View>
  );
}

const styles = themed(() => ({
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  flex: { flex: 1 },
  upper: { fontSize: 14, letterSpacing: 0.8 },
}));