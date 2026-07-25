import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function LandingScreen({ navigation }) {
  return (
    <LinearGradient
      colors={["#FFE6B7", "#E8FFD9", "#FFF0D1"]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Logo */}

        <View style={styles.logoContainer}>
          <MaterialCommunityIcons
            name="flower"
            size={90}
            color="#2E7D32"
          />

          <Text style={styles.title}>
            MyPlantPal
          </Text>

          <Text style={styles.subtitle}>
            Your Friendly AI Gardening Assistant
          </Text>
        </View>

        {/* Get Started Button */}

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.buttonText}>
            Get Started
          </Text>

          <MaterialCommunityIcons
            name="arrow-right-circle"
            size={26}
            color="white"
          />
        </TouchableOpacity>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  safeArea: {
    flex: 1,
    justifyContent: "space-evenly",
    alignItems: "center",
    paddingHorizontal: 30,
  },

  logoContainer: {
    alignItems: "center",
  },

  title: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#8B5E3C",
    marginTop: 20,
  },

  subtitle: {
    marginTop: 12,
    fontSize: 17,
    color: "#555",
    textAlign: "center",
    paddingHorizontal: 30,
  },

  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "#2E7D32",

    width: "100%",
    paddingVertical: 18,

    borderRadius: 20,

    elevation: 8,
  },

  buttonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "600",
    marginRight: 10,
  },
});