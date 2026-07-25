import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function HealthBadge({ health }) {
  let color = "#43A047";
  let text = "Healthy";

  if (health < 85) {
    color = "#FB8C00";
    text = "Needs Care";
  }

  if (health < 60) {
    color = "#E53935";
    text = "Critical";
  }

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: color,
        },
      ]}
    >
      <Text style={styles.text}>
        {health}% • {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "flex-start",
  },

  text: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },
});