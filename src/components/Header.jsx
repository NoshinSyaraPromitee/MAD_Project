import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Header() {
  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>🌞 Good Morning,</Text>

      <Text style={styles.name}>Noshin 👋</Text>

      <Text style={styles.subtitle}>
        Let's take care of your lovely plants today.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 25,
  },

  greeting: {
    fontSize: 18,
    color: "#666",
  },

  name: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#2E7D32",
    marginTop: 5,
  },

  subtitle: {
    marginTop: 8,
    fontSize: 15,
    color: "#777",
  },
});