import React, { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { gradient, palette, creamA } from "../theme/colors";
import { themed } from "../theme/themed";

// One loop of a sine-like wave, shifted by `phase` quarter turns.
function wave(value, amp, phase = 0) {
  const cycle = [0, amp, 0, -amp];
  const shift = ((phase % 4) + 4) % 4;
  const out = [...cycle.slice(shift), ...cycle.slice(0, shift)];
  out.push(out[0]);
  return value.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: out,
  });
}

function twinkle(value, phase = 0) {
  const cycle = [0.65, 1, 0.65, 0.3];
  const shift = ((phase % 4) + 4) % 4;
  const out = [...cycle.slice(shift), ...cycle.slice(0, shift)];
  out.push(out[0]);
  return value.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: out,
  });
}

/** Slowly drifting blobs, twinkling sparkles and leaves (landing-page decor). */
export function BackgroundDecor() {
  const { width: w, height: h } = useWindowDimensions();
  const t = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(t, {
        toValue: 1,
        duration: 12000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    loop.start();
    return () => loop.stop();
  }, [t]);

  const drift = (key, pos, amp, phase, child) => (
    <Animated.View
      key={key}
      style={[
        styles.abs,
        pos,
        {
          transform: [
            { translateX: wave(t, amp, phase) },
            { translateY: wave(t, amp, phase + 1) },
          ],
        },
      ]}
    >
      {child}
    </Animated.View>
  );

  const blob = (size, color) => (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
      }}
    />
  );

  const icon = (name, size, alpha, rot, phase) => (
    <Animated.View
      style={{
        opacity: twinkle(t, phase),
        transform: [{ rotate: `${rot}rad` }],
      }}
    >
      <MaterialCommunityIcons name={name} size={size} color={creamA(alpha * palette.decorK)} />
    </Animated.View>
  );

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {/* Blobs */}
      {drift("b1", { left: -60, top: -70 }, 14, 0, blob(260, creamA(0.28 * palette.decorK)))}
      {drift("b2", { right: -70, bottom: -90 }, 16, 2, blob(300, "rgba(0,0,0,0.14)"))}
      {drift("b3", { left: -50, bottom: h * 0.12 }, 12, 3, blob(190, `rgba(212,194,110,${0.3 * palette.decorK})`))}
      {drift("b4", { right: -55, top: h * 0.38 }, 12, 1, blob(160, creamA(0.18 * palette.decorK)))}

      {/* Sparkles */}
      {drift("s1", { right: 26, top: h * 0.12 }, 6, 1, icon("star-four-points", 22, 0.75, 0, 0))}
      {drift("s2", { left: 24, top: h * 0.27 }, 6, 2, icon("star-four-points", 16, 0.6, 0, 2))}
      {drift("s3", { left: w * 0.55, top: h * 0.06 }, 5, 3, icon("star-four-points", 13, 0.55, 0, 3))}
      {drift("s4", { right: w * 0.28, bottom: h * 0.18 }, 6, 0, icon("star-four-points", 15, 0.6, 0, 1))}

      {/* Leaves */}
      {drift("l1", { right: 28, bottom: h * 0.26 }, 10, 1, icon("leaf", 32, 0.4, 0.5, 1))}
      {drift("l2", { left: 16, top: h * 0.46 }, 10, 2, icon("sprout", 28, 0.38, -0.6, 2))}
      {drift("l3", { right: 18, top: h * 0.6 }, 10, 3, icon("leaf", 24, 0.34, 0.8, 3))}
      {drift("l4", { left: w * 0.38, bottom: 36 }, 8, 0, icon("sprout", 24, 0.34, -0.3, 0))}
    </View>
  );
}

/** Gradient + decor used behind every screen. */
export default function GradientBackground({ children, style, decor = true }) {
  return (
    <LinearGradient
      colors={gradient.colors}
      locations={gradient.locations}
      style={[styles.fill, style]}
    >
      {decor ? <BackgroundDecor /> : null}
      {children}
    </LinearGradient>
  );
}

const styles = themed(() => ({
  fill: { flex: 1, backgroundColor: palette.teal },
  abs: { position: "absolute" },
}));