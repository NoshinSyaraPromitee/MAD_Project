import React from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import GradientBackground from "../components/GradientBackground";
import RiveMascot, { MASCOT_NAME } from "../components/RiveMascot";
import MenuTile from "../components/MenuTile";
import myPlants from "../data/myPlants";
import { gradient, palette, creamA } from "../theme/colors";
import { inter } from "../theme/typography";
import { shadow } from "../theme/theme";
import { DOT } from "../utils/format";
import { themed } from "../theme/themed";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning! Your plants missed you!";
  if (hour < 18) return "Good afternoon! Time to check on your leafy friends.";
  return "Good evening! One last peek before bed?";
}

// A plant that needs water today wins over the time-of-day greeting.
function getBubbleText() {
  const thirsty = myPlants.find((p) => p.waterLevel === "Today");
  if (thirsty) return `${thirsty.nickname} is looking thirsty - time for a drink!`;
  return getGreeting();
}

function HeroMascot() {
  const { width: screenW } = useWindowDimensions();
  const w = Math.max(104, Math.min(128, screenW * 0.34));
  const h = w * 1.17;

  return (
    <View style={{ width: w }}>
      <LinearGradient
        colors={gradient.colors}
        locations={gradient.locations}
        style={[styles.mascotFrame, { width: w, height: h }]}
      >
        <RiveMascot width={w * 1.1} height={h * 1.1} />
      </LinearGradient>
      <View style={styles.nameTag}>
        <Text style={inter(12, "800", palette.ink)} numberOfLines={1}>
          {MASCOT_NAME}
        </Text>
      </View>
    </View>
  );
}

export default function HomeScreen({ navigation }) {
  const avgHealth = myPlants.length
    ? Math.round(myPlants.reduce((s, p) => s + p.health, 0) / myPlants.length)
    : 0;

  return (
    <GradientBackground>
      <SafeAreaView style={styles.flex} edges={["top"]}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Top bar: garden summary + notifications */}
          <View style={styles.topRow}>
            <View style={styles.chip}>
              <LinearGradient colors={["#FFE04A", "#F5A300"]} style={styles.chipIcon}>
                <MaterialCommunityIcons name="sprout" size={16} color="#FFF2A8" />
              </LinearGradient>
              <Text style={[inter(12, "800", palette.ink), styles.flexShrink]} numberOfLines={1}>
                {myPlants.length} plants {DOT} {avgHealth}% health
              </Text>
            </View>

            <Pressable
              style={({ pressed }) => [styles.bell, pressed && { opacity: 0.8 }]}
              onPress={() => Alert.alert("Notifications", "No new notifications yet.")}
            >
              <MaterialCommunityIcons name="bell-outline" size={24} color={palette.accent} />
            </Pressable>
          </View>

          {/* Hero: mascot + greeting bubble + upload */}
          <LinearGradient
            colors={[palette.teal, palette.tealLight]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.hero}
          >
            <HeroMascot />

            <View style={styles.heroRight}>
              <Pressable
                style={({ pressed }) => [styles.bubble, pressed && { opacity: 0.85 }]}
                onPress={() => navigation.navigate("MyPlants")}
              >
                <Text style={inter(14, "700", palette.cream, { lineHeight: 19 })}>
                  {getBubbleText()}
                </Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [styles.upload, pressed && { opacity: 0.9 }]}
                onPress={() => navigation.navigate("Scan")}
              >
                <Text style={[inter(13, "800", palette.accent), styles.flex]} numberOfLines={2}>
                  Upload a plant photo
                </Text>
                <MaterialCommunityIcons
                  name="arrow-right-circle-outline"
                  size={24}
                  color={palette.accent}
                />
              </Pressable>
            </View>
          </LinearGradient>

          {/* Bento grid */}
          <View style={styles.bento}>
            <View style={{ flex: 11 }}>
              <MenuTile
                layout="tall"
                label="My Plants"
                icon="flower"
                iconColor={palette.accent}
                fill={palette.surface}
                onPress={() => navigation.navigate("MyPlants")}
              />
            </View>
            <View style={styles.gap} />
            <View style={{ flex: 10 }}>
              <MenuTile
                layout="compact"
                label="AI Doctor"
                icon="stethoscope"
                fill={palette.sageTile}
                onPress={() => navigation.navigate("AI Doctor")}
              />
              <View style={styles.gapV} />
              <MenuTile
                layout="compact"
                label="Care Calendar"
                icon="calendar-check"
                iconColor={palette.goldIcon}
                fill={palette.goldTile}
                onPress={() => navigation.navigate("CareCalendar")}
              />
            </View>
          </View>

          <View style={styles.wide}>
            <MenuTile
              label="Fertilizer Recipes"
              icon="flask-outline"
              iconColor={palette.brownIcon}
              fill={palette.surface}
              onPress={() => navigation.navigate("FertilizerRecipes")}
            />
          </View>
          <View style={styles.wide}>
            <MenuTile
              label="Care Guide"
              icon="book-open-page-variant-outline"
              fill={palette.sageTile}
              onPress={() => navigation.navigate("CareGuide")}
            />
          </View>
          <View style={styles.wide}>
            <MenuTile
              label="Shop"
              icon="storefront-outline"
              fill={palette.teal}
              dark
              onPress={() => navigation.navigate("Shop")}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = themed(() => ({
  flex: { flex: 1 },
  flexShrink: { flexShrink: 1 },
  content: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 28 },
  topRow: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  chip: {
    flexShrink: 1,
    marginRight: "auto",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: palette.surface,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: palette.accent,
    paddingLeft: 5,
    paddingRight: 14,
    paddingVertical: 5,
    ...shadow(3),
  },
  chipIcon: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  bell: {
    marginLeft: 12,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: palette.surface,
    borderWidth: 1.5,
    borderColor: palette.accent,
    alignItems: "center",
    justifyContent: "center",
    ...shadow(3),
  },
  hero: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 14,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: creamA(0.75),
    ...shadow(10, 0.3),
  },
  mascotFrame: {
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: palette.cream,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  nameTag: {
    marginTop: 8,
    backgroundColor: palette.surface,
    borderRadius: 999,
    paddingVertical: 3,
    alignItems: "center",
  },
  heroRight: { flex: 1, marginLeft: 14 },
  bubble: {
    backgroundColor: creamA(0.16),
    borderRadius: 16,
    padding: 12,
  },
  upload: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: palette.surface,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    ...shadow(3),
  },
  bento: { flexDirection: "row", height: 214, marginTop: 16 },
  gap: { width: 12 },
  gapV: { height: 12 },
  wide: { height: 92, marginTop: 12 },
}));