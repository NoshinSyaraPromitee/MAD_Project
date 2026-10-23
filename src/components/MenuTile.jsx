import React from "react";
import { Pressable, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { palette, creamA } from "../theme/colors";
import { inter } from "../theme/typography";
import { shadow } from "../theme/theme";
import { themed } from "../theme/themed";

function ArrowDot({ dark }) {
  return (
    <View style={[styles.dot, { backgroundColor: dark ? palette.cream : palette.teal }]}>
      <MaterialCommunityIcons
        name="arrow-right"
        size={18}
        color={dark ? palette.teal : palette.cream}
      />
    </View>
  );
}

/** Bento tile for the home menu. layout: "tall" | "compact" | "wide". */
export default function MenuTile({
  layout = "wide",
  label,
  icon,
  iconColor = palette.accent,
  fill = palette.surface,
  dark = false,
  onPress,
  style,
}) {
  const ink = dark ? palette.cream : palette.ink;

  let content;
  if (layout === "tall") {
    content = (
      <View style={styles.tall}>
        <View style={styles.topRight}>
          <ArrowDot dark={dark} />
        </View>
        <View style={styles.center}>
          <View style={[styles.bigCircle, { backgroundColor: palette.glass }]}>
            <MaterialCommunityIcons name={icon} size={64} color={iconColor} />
          </View>
        </View>
        <Text style={[inter(16, "800", ink), styles.centerText]} numberOfLines={2}>
          {label}
        </Text>
      </View>
    );
  } else if (layout === "compact") {
    content = (
      <View style={styles.compact}>
        <View style={styles.center}>
          <MaterialCommunityIcons name={icon} size={40} color={iconColor} />
        </View>
        <Text
          style={[inter(14, "800", ink), styles.centerText]}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {label}
        </Text>
      </View>
    );
  } else {
    content = (
      <View style={styles.wide}>
        <View
          style={[
            styles.iconBox,
            { backgroundColor: dark ? palette.cream : palette.glass },
          ]}
        >
          <MaterialCommunityIcons name={icon} size={36} color={iconColor} />
        </View>
        <Text style={[inter(17, "800", ink), styles.flex]} numberOfLines={2}>
          {label}
        </Text>
        <ArrowDot dark={dark} />
      </View>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.tile,
        {
          backgroundColor: fill,
          borderColor: dark ? creamA(0.8) : palette.edge,
        },
        pressed && styles.pressed,
        style,
      ]}
    >
      {content}
    </Pressable>
  );
}

const styles = themed(() => ({
  tile: {
    flex: 1,
    borderRadius: 24,
    borderWidth: 2,
    overflow: "hidden",
    ...shadow(4, 0.3),
  },
  pressed: { opacity: 0.9, transform: [{ scale: 0.98 }] },
  flex: { flex: 1 },
  tall: { flex: 1, paddingHorizontal: 14, paddingTop: 12, paddingBottom: 14 },
  topRight: { alignItems: "flex-end" },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  bigCircle: {
    width: 104,
    height: 104,
    borderRadius: 52,
    alignItems: "center",
    justifyContent: "center",
  },
  centerText: { textAlign: "center", marginTop: 6 },
  compact: { flex: 1, padding: 10 },
  wide: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 14,
  },
  iconBox: {
    width: 64,
    height: 64,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  dot: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
}));