import React from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import GradientBackground from "../components/GradientBackground";
import BackButton from "../components/BackButton";
import AppButton from "../components/AppButton";
import HealthBadge from "../components/HealthBadge";
import HealthRing from "../components/HealthRing";
import SectionTitle from "../components/SectionTitle";
import { palette, tealA } from "../theme/colors";
import { fredoka, inter } from "../theme/typography";
import { shadow } from "../theme/theme";
import { themed } from "../theme/themed";

export default function PlantDetailsScreen({ route, navigation }) {
  const { plant } = route.params;

  const info = [
    { icon: "water", color: palette.waterBlue, label: "Water", value: plant.waterLevel },
    { icon: "white-balance-sunny", color: palette.sunAmber, label: "Sunlight", value: plant.sunlight },
    { icon: "map-marker", color: "#43A047", label: "Location", value: plant.location },
    { icon: "water-percent", color: "#00ACC1", label: "Humidity", value: plant.humidity },
  ];

  const tasks = [
    { icon: "check-circle", color: "#4CAF50", text: "Water Plant Tomorrow" },
    { icon: "flower", color: "#FB8C00", text: `Fertilize ${plant.fertilizer}` },
    { icon: "camera-outline", color: "#5C6BC0", text: `Last Scan: ${plant.lastScan}` },
  ];

  return (
    <GradientBackground>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        {/* Photo header */}
        <View>
          <Image source={{ uri: plant.image }} style={styles.image} />
          <SafeAreaView edges={["top"]} style={styles.headerOverlay}>
            <BackButton />
            <Pressable style={styles.circleBtn} hitSlop={8}>
              <MaterialCommunityIcons name="pencil-outline" size={22} color={palette.accent} />
            </Pressable>
          </SafeAreaView>
        </View>

        {/* Cream sheet */}
        <View style={styles.sheet}>
          <View style={styles.heroRow}>
            <View style={styles.flex}>
              <Text style={fredoka(32, "700", palette.ink)} numberOfLines={1} adjustsFontSizeToFit>
                {plant.nickname}
              </Text>
              <Text style={[inter(16, "500", palette.textMuted), styles.species]}>
                {plant.species}
              </Text>
              <HealthBadge health={plant.health} />
            </View>
            <HealthRing health={plant.health} />
          </View>

          {/* Info grid */}
          <View style={styles.grid}>
            {info.map((i) => (
              <View key={i.label} style={styles.infoCard}>
                <View style={[styles.infoIcon, { backgroundColor: `${i.color}22` }]}>
                  <MaterialCommunityIcons name={i.icon} size={24} color={i.color} />
                </View>
                <Text style={[inter(12, "600", palette.textMuted), styles.infoLabel]}>{i.label}</Text>
                <Text style={inter(15, "800", palette.accent)} numberOfLines={1}>
                  {i.value}
                </Text>
              </View>
            ))}
          </View>

          {/* Care */}
          <SectionTitle title="Today's Care" onCard />
          {tasks.map((t) => (
            <View key={t.text} style={styles.taskCard}>
              <MaterialCommunityIcons name={t.icon} size={24} color={t.color} />
              <Text style={[inter(15, "600", palette.textDark), styles.taskText]}>{t.text}</Text>
            </View>
          ))}

          <Pressable
            style={styles.guideLink}
            onPress={() => navigation.navigate("CareGuide", { plant })}
            hitSlop={6}
          >
            <Text style={inter(14, "700", palette.accent)}>View Care Guide</Text>
            <MaterialCommunityIcons name="chevron-right" size={20} color={palette.accent} />
          </Pressable>

          {/* Actions */}
          <AppButton
            label="Scan Again"
            leftIcon="camera"
            onPress={() => navigation.navigate("MainTabs", { screen: "Scan" })}
            style={styles.btn}
          />
          <AppButton
            label="Ask AI Doctor"
            leftIcon="robot-outline"
            variant="secondary"
            onPress={() => navigation.navigate("MainTabs", { screen: "AI Doctor" })}
            style={styles.btn2}
          />
        </View>
      </ScrollView>
    </GradientBackground>
  );
}

const styles = themed(() => ({
  flex: { flex: 1 },
  image: { width: "100%", height: 320, backgroundColor: tealA(0.2) },
  headerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  circleBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: palette.surface,
    borderWidth: 2,
    borderColor: palette.accent,
    alignItems: "center",
    justifyContent: "center",
    ...shadow(4),
  },
  sheet: {
    marginTop: -28,
    backgroundColor: palette.surface,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 48,
    minHeight: 500,
  },
  heroRow: { flexDirection: "row", alignItems: "center" },
  species: { marginBottom: 10 },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginTop: 18 },
  infoCard: {
    width: "48%",
    backgroundColor: palette.surfaceAlt,
    borderRadius: 20,
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: palette.greenCardFill,
  },
  infoIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
  },
  infoLabel: { marginTop: 8, marginBottom: 2 },
  taskCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: tealA(0.06),
    padding: 16,
    borderRadius: 18,
    marginBottom: 10,
  },
  taskText: { marginLeft: 14, flex: 1 },
  guideLink: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
    marginTop: 2,
  },
  btn: { marginTop: 18 },
  btn2: { marginTop: 12 },
}));