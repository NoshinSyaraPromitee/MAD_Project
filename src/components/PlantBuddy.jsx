import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Easing } from "react-native";

// A hand-built cartoon mascot — no image assets needed, just shapes.
export default function PlantBuddy({ message }) {
  const bounce = useRef(new Animated.Value(0)).current;
  const wave = useRef(new Animated.Value(0)).current;
  const blink = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Gentle idle bounce, forever
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounce, {
          toValue: -8,
          duration: 900,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(bounce, {
          toValue: 0,
          duration: 900,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Little arm wave every few seconds
    Animated.loop(
      Animated.sequence([
        Animated.timing(wave, {
          toValue: 1,
          duration: 260,
          useNativeDriver: true,
        }),
        Animated.timing(wave, {
          toValue: 0,
          duration: 260,
          useNativeDriver: true,
        }),
        Animated.timing(wave, {
          toValue: 1,
          duration: 260,
          useNativeDriver: true,
        }),
        Animated.timing(wave, {
          toValue: 0,
          duration: 260,
          useNativeDriver: true,
        }),
        Animated.delay(2600),
      ])
    ).start();

    // Occasional blink
    Animated.loop(
      Animated.sequence([
        Animated.delay(3200),
        Animated.timing(blink, {
          toValue: 0.1,
          duration: 90,
          useNativeDriver: true,
        }),
        Animated.timing(blink, {
          toValue: 1,
          duration: 90,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const armRotation = wave.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "-25deg"],
  });

  return (
    <View style={styles.wrapper}>
      {message ? (
        <View style={styles.bubble}>
          <Text style={styles.bubbleText}>{message}</Text>
          <View style={styles.bubbleTail} />
        </View>
      ) : null}

      <Animated.View
        style={[
          styles.character,
          { transform: [{ translateY: bounce }] },
        ]}
      >
        {/* Left leaf sprout */}
        <View style={[styles.leaf, styles.leafLeft]} />
        {/* Right leaf sprout */}
        <View style={[styles.leaf, styles.leafRight]} />

        {/* Head */}
        <View style={styles.head}>
          {/* Cheeks */}
          <View style={[styles.cheek, styles.cheekLeft]} />
          <View style={[styles.cheek, styles.cheekRight]} />

          {/* Eyes */}
          <View style={styles.eyesRow}>
            <Animated.View
              style={[styles.eye, { transform: [{ scaleY: blink }] }]}
            >
              <View style={styles.pupil} />
            </Animated.View>

            <Animated.View
              style={[styles.eye, { transform: [{ scaleY: blink }] }]}
            >
              <View style={styles.pupil} />
            </Animated.View>
          </View>

          {/* Smile */}
          <View style={styles.smile} />
        </View>

        {/* Waving arm */}
        <Animated.View
          style={[
            styles.arm,
            { transform: [{ rotate: armRotation }] },
          ]}
        />
        <View style={[styles.arm, styles.armStatic]} />

        {/* Pot */}
        <View style={styles.pot}>
          <View style={styles.potRim} />
        </View>
      </Animated.View>
    </View>
  );
}

const GREEN = "#4CAF50";
const DARK_GREEN = "#2E7D32";
const POT = "#D98A4B";
const POT_DARK = "#B96F35";

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    marginBottom: 10,
  },

  character: {
    width: 140,
    height: 150,
    alignItems: "center",
  },

  leaf: {
    position: "absolute",
    top: -6,
    width: 26,
    height: 26,
    backgroundColor: GREEN,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },

  leafLeft: {
    left: 44,
    transform: [{ rotate: "-25deg" }],
  },

  leafRight: {
    right: 44,
    transform: [{ rotate: "115deg" }],
  },

  head: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: GREEN,
    marginTop: 12,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },

  cheek: {
    position: "absolute",
    width: 14,
    height: 8,
    borderRadius: 7,
    backgroundColor: "#FFAFAF",
    opacity: 0.7,
    top: 42,
  },

  cheekLeft: {
    left: 8,
  },

  cheekRight: {
    right: 8,
  },

  eyesRow: {
    flexDirection: "row",
    marginBottom: 8,
  },

  eye: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "white",
    marginHorizontal: 6,
    alignItems: "center",
    justifyContent: "center",
  },

  pupil: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#1B3B1F",
  },

  smile: {
    width: 20,
    height: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderWidth: 2.5,
    borderTopWidth: 0,
    borderColor: "#1B3B1F",
  },

  arm: {
    position: "absolute",
    top: 68,
    right: 14,
    width: 22,
    height: 8,
    borderRadius: 4,
    backgroundColor: DARK_GREEN,
  },

  armStatic: {
    right: undefined,
    left: 14,
    transform: [{ rotate: "20deg" }],
  },

  pot: {
    width: 70,
    height: 46,
    backgroundColor: POT,
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
    marginTop: -4,
    alignItems: "center",
    elevation: 3,
  },

  potRim: {
    width: 80,
    height: 12,
    backgroundColor: POT_DARK,
    borderRadius: 6,
    marginTop: -4,
  },

  bubble: {
    backgroundColor: "white",
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 18,
    maxWidth: 260,
    marginBottom: 6,
    elevation: 4,
  },

  bubbleText: {
    color: "#333",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },

  bubbleTail: {
    position: "absolute",
    bottom: -8,
    left: "50%",
    marginLeft: -8,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 10,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "white",
  },
});