import React from "react";
import { View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import RiveMascot from "./RiveMascot";
import { gradient, palette, creamA } from "../theme/colors";
import { shadow } from "../theme/theme";
import { themed } from "../theme/themed";

/** Mascot inside a rounded card that reuses the page gradient, with a soft glow. */
export default function MascotCard({ size = 240, glow = true, leaves = true }) {
  const r = size * 0.16;

  return (
    <View style={{ width: size * 1.25, height: size * 1.25, alignItems: "center", justifyContent: "center" }}>
      {glow ? (
        <View
          style={[
            styles.glow,
            { width: size * 1.2, height: size * 1.2, borderRadius: size * 0.6 },
          ]}
        />
      ) : null}

      <LinearGradient
        colors={gradient.colors}
        locations={[0, 0.5, 1]}
        style={[styles.card, { width: size, height: size, borderRadius: r }]}
      >
        <RiveMascot width={size - 6} height={size - 6} />
      </LinearGradient>

      {leaves ? (
        <>
          <MaterialCommunityIcons
            name="leaf"
            size={34}
            color={palette.cream}
            style={[styles.leaf, { top: size * 0.04, right: size * 0.02, transform: [{ rotate: "35deg" }] }]}
          />
          <MaterialCommunityIcons
            name="leaf"
            size={26}
            color={creamA(0.75)}
            style={[styles.leaf, { bottom: size * 0.06, left: 0, transform: [{ rotate: "-40deg" }] }]}
          />
        </>
      ) : null}
    </View>
  );
}

const styles = themed(() => ({
  glow: {
    position: "absolute",
    backgroundColor: creamA(0.22),
  },
  card: {
    borderWidth: 3,
    borderColor: creamA(0.75),
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    ...shadow(10, 0.3),
  },
  leaf: { position: "absolute" },
}));