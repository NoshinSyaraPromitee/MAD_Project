import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  ActivityIndicator,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function SplashScreen({ navigation }) {
  const scale = useRef(new Animated.Value(0.7)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      navigation.replace("Landing");
    }, 2200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient
      colors={["#FFE6B7", "#E8FFD9", "#FFF0D1"]}
      style={styles.container}
    >
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity,
            transform: [{ scale }],
          },
        ]}
      >
        <MaterialCommunityIcons
          name="flower"
          size={110}
          color="#2E7D32"
        />

        <Text style={styles.title}>
          MyPlantPal
        </Text>

        <Text style={styles.subtitle}>
          Your Friendly AI Gardening Assistant
        </Text>
      </Animated.View>

      <View style={styles.loaderContainer}>
        <ActivityIndicator
          size="large"
          color="#2E7D32"
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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

  loaderContainer: {
    position: "absolute",
    bottom: 70,
  },
});