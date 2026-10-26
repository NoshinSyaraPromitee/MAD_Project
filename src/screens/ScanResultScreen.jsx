// ===============================
// src/screens/ScanResultScreen.jsx
// ===============================

import React from "react";
import { Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import AppScreen from "../components/AppScreen";
import AppCard from "../components/AppCard";
import AppButton from "../components/AppButton";
import HealthRing from "../components/HealthRing";
import HealthBadge from "../components/HealthBadge";
import { palette, tealA } from "../theme/colors";
import { fredoka, inter } from "../theme/typography";
import { themed } from "../theme/themed";

const result = {
  name: "Monstera Deliciosa",
  health: 95,
  status: "Healthy Plant",
  type: "Indoor Plant",
};

export default function ScanResultScreen({ navigation }) {
  const rows = [
    { icon: "heart-pulse", color: "#43A047", label: "Health Score", value: `${result.health}%` },
    { icon: "leaf", color: palette.accent, label: "Condition", value: result.status },
    { icon: "home-outline", color: palette.brown, label: "Type", value: result.type },
  ];

  return (
    <AppScreen title="Plant Identified" scroll>
      <AppCard style={styles.card} padding={22}>
        <View style={styles.top}>
          <View style={styles.flex}>
            <Text style={inter(12, "700", palette.textMuted, { letterSpacing: 0.8 })}>
              WE THINK THIS IS
            </Text>
            <Text style={[fredoka(26, "700", palette.ink), styles.name]}>{result.name}</Text>
            <HealthBadge health={result.health} />
          </View>
          <HealthRing health={result.health} />
        </View>

        <View style={styles.divider} />

        {rows.map((r) => (
          <View key={r.label} style={styles.row}>
            <View style={[styles.iconCircle, { backgroundColor: `${r.color}1F` }]}>
              <MaterialCommunityIcons name={r.icon} size={20} color={r.color} />
            </View>
            <Text style={[inter(14, "600", palette.textMuted), styles.flex]}>{r.label}</Text>
            <Text style={inter(15, "800", palette.textDark)}>{r.value}</Text>
          </View>
        ))}
      </AppCard>

      <AppButton
        label="View Care Guide"
        rightIcon="book-open-page-variant-outline"
        onPress={() => navigation.navigate("CareGuide")}
        style={styles.button}
      />
      <AppButton
        label="Ask AI Doctor"
        variant="secondary"
        rightIcon="robot-outline"
        onPress={() => navigation.navigate("MainTabs", { screen: "AI Doctor" })}
        style={styles.button2}
      />
    </AppScreen>
  );
}

const styles = themed(() => ({
  flex: { flex: 1 },
  card: { marginTop: 16 },
  top: { flexDirection: "row", alignItems: "center" },
  name: { marginTop: 4, marginBottom: 10 },
  divider: { height: 1, backgroundColor: tealA(0.12), marginVertical: 16 },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  button: { marginTop: 24 },
  button2: { marginTop: 12 },
}));