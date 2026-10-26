import React from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import GradientBackground from "./GradientBackground";
import BackButton from "./BackButton";
import { fredoka } from "../theme/typography";
import { themed } from "../theme/themed";

/**
 * Standard screen: gradient + safe area + [back] Title [trailing].
 * Tab screens pass edges={["top"]} (the tab bar handles the bottom inset).
 */
export default function AppScreen({
  title,
  children,
  showBack = true,
  onBack,
  trailing,
  sideWidth = 48,
  padded = true,
  scroll = false,
  contentStyle,
  edges = ["top", "left", "right", "bottom"],
}) {
  return (
    <GradientBackground>
      <SafeAreaView style={styles.flex} edges={edges}>
        <View style={styles.header}>
          <View style={[styles.side, { width: sideWidth }]}>
            {showBack ? <BackButton onPress={onBack} /> : null}
          </View>

          <Text
            style={styles.title}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.7}
          >
            {title}
          </Text>

          <View style={[styles.side, styles.sideRight, { width: sideWidth }]}>
            {trailing}
          </View>
        </View>

        {scroll ? (
          <ScrollView
            style={styles.flex}
            contentContainerStyle={[padded && styles.pad, styles.scrollBottom, contentStyle]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {children}
          </ScrollView>
        ) : (
          <View style={[styles.flex, padded && styles.pad, contentStyle]}>{children}</View>
        )}
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = themed(() => ({
  flex: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 6,
  },
  side: { alignItems: "flex-start", justifyContent: "center" },
  sideRight: { alignItems: "flex-end" },
  title: {
    flex: 1,
    textAlign: "center",
    ...fredoka(30, "700"),
    letterSpacing: 0.2,
  },
  pad: { paddingHorizontal: 20 },
  scrollBottom: { paddingBottom: 32 },
}));