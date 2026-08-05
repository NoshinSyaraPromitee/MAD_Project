// ===============================
// src/screens/ScanPlantScreen.jsx
// ===============================

import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function ScanPlantScreen({ navigation }) {
  return (
    <LinearGradient
      colors={["#FFF7E7", "#E8FFD8", "#FFF8EC"]}
      style={styles.container}
    >
      <SafeAreaView style={styles.content}>

        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={28}
            color="#2E7D32"
          />
        </TouchableOpacity>

        <Text style={styles.title}>
          Scan Your Plant
        </Text>

        <View style={styles.circle}>
          <MaterialCommunityIcons
            name="camera"
            size={90}
            color="#2E7D32"
          />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            navigation.navigate("ScanResult")
          }
        >
          <Text style={styles.buttonText}>
            Open Camera
          </Text>
        </TouchableOpacity>

      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    top: 15,
    left: 20,
    padding: 4,
    zIndex: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 40,
    color: "#2E7D32",
  },
  circle: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    marginTop: 40,
    backgroundColor: "#2E7D32",
    padding: 18,
    paddingHorizontal: 50,
    borderRadius: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});