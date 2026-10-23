import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import AppScreen from "../components/AppScreen";
import AppCard from "../components/AppCard";
import SectionTitle from "../components/SectionTitle";
import RiveMascot from "../components/RiveMascot";
import { palette, creamA, tealA } from "../theme/colors";
import { fredoka, inter } from "../theme/typography";
import { shadow } from "../theme/theme";
import { themed } from "../theme/themed";

const DEG = "\u00B0";
const DASH = "\u2013";

const defaultGuide = {
  species: `Category ${DASH} General Houseplant`,
  water: "Twice a week",
  sunlight: "Bright indirect light",
  temperature: `20${DEG}C ${DASH} 28${DEG}C`,
  fertilizer: "Every 2 weeks",
  humidity: "60%",
};

const proTips = [
  "Rotate your plant a quarter turn every week so it grows evenly toward the light.",
  "Let the top inch of soil dry out before watering again to avoid root rot.",
  "Wipe leaves with a damp cloth monthly so they can breathe and photosynthesize better.",
  `Repot every 12${DASH}18 months into a pot just one size larger than the current one.`,
];

const commonProblems = [
  {
    icon: "alert-circle-outline",
    color: "#E53935", // red
    ink: "#FFFFFF",
    title: "Yellow leaves",
    fix: "Usually overwatering. Let soil dry out more between waterings.",
  },
  {
    icon: "fire",
    color: "#F6C026", // yellow
    ink: "#3B2A00",
    title: "Brown, crispy tips",
    fix: "Low humidity or too much direct sun. Mist leaves or move away from windows.",
  },
  {
    icon: "arrow-down-bold-circle-outline",
    color: "#1E88E5", // blue
    ink: "#FFFFFF",
    title: "Drooping stems",
    fix: "Thirsty plant or shock from a recent move. Water thoroughly and give it a few days.",
  },
];

const defaultDailyTasks = [
  { icon: "water-outline", label: "Check soil moisture" },
  { icon: "white-balance-sunny", label: "Make sure it's getting enough light" },
  { icon: "spray-bottle", label: "Mist the leaves" },
  { icon: "broom", label: "Wipe dust off the leaves" },
  { icon: "magnify-scan", label: "Look for pests or yellow leaves" },
];

export default function CareGuideScreen({ route }) {
  const plant = route?.params?.plant;
  const [checkedTasks, setCheckedTasks] = useState({});

  const dailyTasks = plant
    ? [
        { icon: "water-outline", label: `Water: ${plant.waterLevel}` },
        { icon: "white-balance-sunny", label: `Sunlight: ${plant.sunlight}` },
        { icon: "spray-bottle", label: "Mist the leaves" },
        { icon: "broom", label: "Wipe dust off the leaves" },
        { icon: "magnify-scan", label: "Look for pests or yellow leaves" },
      ]
    : defaultDailyTasks;

  const toggleTask = (index) =>
    setCheckedTasks((prev) => ({ ...prev, [index]: !prev[index] }));

  const completedCount = dailyTasks.filter((_, i) => checkedTasks[i]).length;
  const progress = completedCount / dailyTasks.length;

  const guide = plant
    ? {
        species: plant.species,
        water: plant.waterLevel,
        sunlight: plant.sunlight,
        temperature: defaultGuide.temperature,
        fertilizer: plant.fertilizer,
        humidity: plant.humidity,
      }
    : defaultGuide;

  const essentials = [
    { icon: "water", color: palette.waterBlue, label: "Water", value: guide.water },
    { icon: "white-balance-sunny", color: palette.sunAmber, label: "Sunlight", value: guide.sunlight },
    { icon: "thermometer", color: "#E53935", label: "Temp", value: guide.temperature },
    { icon: "leaf", color: "#43A047", label: "Fertilizer", value: guide.fertilizer },
    { icon: "water-percent", color: "#00ACC1", label: "Humidity", value: guide.humidity },
  ];

  return (
    <AppScreen title="Care Guide" scroll>
      {/* Hero */}
      <LinearGradient
        colors={[palette.teal, palette.tealLight]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        <View style={styles.flex}>
          <Text style={inter(11, "700", creamA(0.75), { letterSpacing: 1.2 })}>CARE GUIDE</Text>
          <Text style={[fredoka(26, "700", palette.cream), styles.mt4]} numberOfLines={1}>
            {plant ? plant.nickname : "Plant Care 101"}
          </Text>
          <Text style={inter(13, "600", creamA(0.85))} numberOfLines={1}>
            {guide.species}
          </Text>
        </View>
        <View style={styles.heroMascot}>
          <RiveMascot width={84} />
        </View>
      </LinearGradient>

      {/* Daily challenge */}
      <SectionTitle
        title="Today's Care Challenge"
        right={
          <View style={styles.progressPill}>
            <Text style={inter(12, "800", palette.accent)}>
              {completedCount}/{dailyTasks.length}
            </Text>
          </View>
        }
      />

      <View style={styles.track}>
        <View style={[styles.fill, { width: `${progress * 100}%` }]} />
      </View>

      <AppCard padding={12}>
        {dailyTasks.map((task, index) => {
          const done = !!checkedTasks[index];
          return (
            <Pressable
              key={task.label}
              style={[styles.taskRow, done && styles.taskRowDone]}
              onPress={() => toggleTask(index)}
            >
              <View style={[styles.checkbox, done && styles.checkboxOn]}>
                {done ? <MaterialCommunityIcons name="check" size={14} color={palette.cream} /> : null}
              </View>
              <View style={styles.taskIcon}>
                <MaterialCommunityIcons
                  name={task.icon}
                  size={18}
                  color={done ? palette.textMuted : palette.accent}
                />
              </View>
              <Text
                style={[
                  inter(14, "600", done ? palette.textMuted : palette.textDark),
                  styles.flex,
                  done && styles.strike,
                ]}
              >
                {task.label}
              </Text>
            </Pressable>
          );
        })}

        {completedCount === dailyTasks.length ? (
          <View style={styles.doneBanner}>
            <MaterialCommunityIcons name="party-popper" size={18} color={palette.accent} />
            <Text style={[inter(13, "700", palette.accent), styles.flex, styles.ml8]}>
              All done! Your plant is thriving today.
            </Text>
          </View>
        ) : null}
      </AppCard>

      {/* Essentials */}
      <SectionTitle title="Essentials" />
      <View style={styles.grid}>
        {essentials.map((item, i) => {
          const wide = i < 2;
          return (
            <AppCard
              key={item.label}
              padding={12}
              style={[styles.essential, wide ? styles.wide : styles.narrow]}
            >
              <View style={wide ? styles.row : styles.centerCol}>
                <View style={[styles.essIcon, { backgroundColor: `${item.color}22` }, !wide && styles.mb6]}>
                  <MaterialCommunityIcons name={item.icon} size={22} color={item.color} />
                </View>
                <View style={wide ? styles.flex : styles.centerCol}>
                  <Text style={inter(11, "600", palette.textMuted)}>{item.label}</Text>
                  <Text
                    style={[inter(13, "800", palette.textDark), !wide && styles.centerText]}
                    numberOfLines={2}
                  >
                    {item.value}
                  </Text>
                </View>
              </View>
            </AppCard>
          );
        })}
      </View>

      {/* Pro tips */}
      <SectionTitle title="Pro Tips" />
      <AppCard padding={6}>
        {proTips.map((tip, index) => (
          <View key={tip} style={[styles.tipRow, index === proTips.length - 1 && styles.noBorder]}>
            <View style={styles.tipNumber}>
              <Text style={inter(12, "800", palette.cream)}>{index + 1}</Text>
            </View>
            <Text style={[inter(14, "500", palette.textDark, { lineHeight: 21 }), styles.flex]}>
              {tip}
            </Text>
          </View>
        ))}
      </AppCard>

      {/* Common problems */}
      <SectionTitle title="Common Problems" />
      {commonProblems.map((problem) => (
        <AppCard
          key={problem.title}
          padding={0}
          color={problem.color}
          style={[styles.problem, { borderColor: problem.color }]}
        >
          <View style={styles.problemIcon}>
            <MaterialCommunityIcons name={problem.icon} size={22} color={problem.ink} />
          </View>
          <View style={styles.problemText}>
            <Text style={inter(15, "800", problem.ink)}>{problem.title}</Text>
            <Text style={[inter(13, "600", problem.ink, { lineHeight: 18, opacity: 0.92 }), styles.mt4]}>
              {problem.fix}
            </Text>
          </View>
        </AppCard>
      ))}
    </AppScreen>
  );
}

const styles = themed(() => ({
  flex: { flex: 1 },
  row: { flexDirection: "row", alignItems: "center" },
  centerCol: { alignItems: "center" },
  centerText: { textAlign: "center" },
  mt4: { marginTop: 4 },
  ml8: { marginLeft: 8 },
  mb6: { marginBottom: 6 },
  hero: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 28,
    padding: 18,
    marginTop: 10,
    borderWidth: 2,
    borderColor: creamA(0.75),
    ...shadow(8, 0.3),
  },
  heroMascot: {
    width: 92,
    height: 92,
    borderRadius: 22,
    backgroundColor: creamA(0.16),
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
  },
  progressPill: {
    backgroundColor: palette.surface,
    borderRadius: 999,
    paddingHorizontal: 11,
    paddingVertical: 4,
  },
  track: {
    height: 8,
    borderRadius: 4,
    backgroundColor: creamA(0.35),
    overflow: "hidden",
    marginBottom: 12,
  },
  fill: { height: "100%", borderRadius: 4, backgroundColor: palette.cream },
  taskRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 14,
    marginBottom: 4,
  },
  taskRowDone: { backgroundColor: tealA(0.06) },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: palette.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxOn: { backgroundColor: palette.teal },
  taskIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: tealA(0.1),
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10,
  },
  strike: { textDecorationLine: "line-through" },
  doneBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: palette.greenCardFill,
    borderRadius: 14,
    padding: 12,
    marginTop: 6,
  },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  essential: { marginBottom: 10 },
  wide: { width: "48.5%" },
  narrow: { width: "31.5%" },
  essIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  tipRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: tealA(0.1),
  },
  noBorder: { borderBottomWidth: 0 },
  tipNumber: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: palette.teal,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  problem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    overflow: "hidden",
  },
  problemIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 16,
    marginVertical: 14,
  },
  problemText: { flex: 1, marginLeft: 12, marginRight: 14, paddingVertical: 14 },
}));