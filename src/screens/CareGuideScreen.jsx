import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const defaultGuide = {
  species: "Category – General Houseplant",
  water: "Twice a week",
  sunlight: "Bright indirect light",
  temperature: "20°C – 28°C",
  fertilizer: "Every 2 weeks",
  humidity: "60%",
};

const proTips = [
  "Rotate your plant a quarter turn every week so it grows evenly toward the light.",
  "Let the top inch of soil dry out before watering again to avoid root rot.",
  "Wipe leaves with a damp cloth monthly so they can breathe and photosynthesize better.",
  "Repot every 12–18 months into a pot just one size larger than the current one.",
];

const commonProblems = [
  {
    icon: "alert-circle-outline",
    color: "#E53935",
    title: "Yellow leaves",
    fix: "Usually overwatering. Let soil dry out more between waterings.",
  },
  {
    icon: "fire",
    color: "#FB8C00",
    title: "Brown, crispy tips",
    fix: "Low humidity or too much direct sun. Mist leaves or move away from windows.",
  },
  {
    icon: "arrow-down-bold-circle-outline",
    color: "#5C6BC0",
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

export default function CareGuideScreen({ route, navigation }) {
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

  const toggleTask = (index) => {
    setCheckedTasks((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const completedCount = dailyTasks.filter((_, i) => checkedTasks[i]).length;
  const progress = completedCount / dailyTasks.length;

  const guide = plant
    ? {
        species: plant.species,
        water: plant.waterLevel,
        sunlight: plant.sunlight,
        temperature: "20°C – 28°C",
        fertilizer: plant.fertilizer,
        humidity: plant.humidity,
      }
    : defaultGuide;

  const essentials = [
    { icon: "water", color: "#42A5F5", label: "Water", value: guide.water },
    { icon: "white-balance-sunny", color: "#FFB300", label: "Sunlight", value: guide.sunlight },
    { icon: "thermometer", color: "#E53935", label: "Temp", value: guide.temperature },
    { icon: "leaf", color: "#43A047", label: "Fertilizer", value: guide.fertilizer },
    { icon: "water-percent", color: "#00ACC1", label: "Humidity", value: guide.humidity },
  ];

  return (
    <LinearGradient
      colors={["#FFF7E7", "#E8FFD8", "#FFF8EC"]}
      style={{ flex: 1 }}
    >
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons name="arrow-left" size={22} color="#2E7D32" />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Care Guide</Text>
            <View style={styles.headerDot} />
          </View>

          <View style={styles.headerRight}>
            <MaterialCommunityIcons name="sprout" size={20} color="#2E7D32" />
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          {/* Hero – overlapping style */}
          <View style={styles.heroWrap}>
            <LinearGradient
              colors={["#2E7D32", "#43A047"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.hero}
            >
              <View style={styles.heroContent}>
                <View style={styles.heroTextBlock}>
                  <Text style={styles.heroLabel}>TODAY'S FOCUS</Text>
                  <Text style={styles.heroTitle} numberOfLines={1}>
                    {plant ? plant.nickname : "Plant Care 101"}
                  </Text>
                  <Text style={styles.heroSubtitle} numberOfLines={1}>
                    {guide.species}
                  </Text>
                </View>

                {plant ? (
                  <Image source={{ uri: plant.image }} style={styles.heroImage} />
                ) : (
                  <View style={styles.heroIconCircle}>
                    <MaterialCommunityIcons name="flower-tulip" size={32} color="#FFF" />
                  </View>
                )}
              </View>

              {/* Decorative leaf shapes */}
              <View style={styles.heroDecor1} />
              <View style={styles.heroDecor2} />
            </LinearGradient>
          </View>

          {/* Daily Challenge */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Care Challenge</Text>
            <View style={styles.progressPill}>
              <Text style={styles.progressPillText}>
                {completedCount}/{dailyTasks.length}
              </Text>
            </View>
          </View>

          {/* Progress bar */}
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
          </View>

          <View style={styles.challengeCard}>
            {dailyTasks.map((task, index) => {
              const done = !!checkedTasks[index];
              return (
                <TouchableOpacity
                  key={task.label}
                  style={[
                    styles.taskRow,
                    done && styles.taskRowDone,
                    index === dailyTasks.length - 1 && { marginBottom: 0 },
                  ]}
                  activeOpacity={0.75}
                  onPress={() => toggleTask(index)}
                >
                  <View style={[styles.checkbox, done && styles.checkboxChecked]}>
                    {done && (
                      <MaterialCommunityIcons name="check" size={14} color="#FFF" />
                    )}
                  </View>

                  <View style={[styles.taskIconWrap, done && { backgroundColor: "#F0F0F0" }]}>
                    <MaterialCommunityIcons
                      name={task.icon}
                      size={18}
                      color={done ? "#AAA" : "#2E7D32"}
                    />
                  </View>

                  <Text style={[styles.taskText, done && styles.taskTextDone]}>
                    {task.label}
                  </Text>
                </TouchableOpacity>
              );
            })}

            {completedCount === dailyTasks.length && (
              <View style={styles.doneBanner}>
                <MaterialCommunityIcons name="party-popper" size={18} color="#2E7D32" />
                <Text style={styles.doneText}>All done! Your plant is thriving today.</Text>
              </View>
            )}
          </View>

          {/* Essentials – staggered 2+3 layout feel */}
          <Text style={styles.sectionTitle}>Essentials</Text>

          <View style={styles.essentialsGrid}>
            {essentials.map((item, i) => (
              <View
                key={item.label}
                style={[
                  styles.essentialCard,
                  i === 0 || i === 1 ? styles.essentialWide : styles.essentialNarrow,
                ]}
              >
                <View style={[styles.essentialIcon, { backgroundColor: `${item.color}18` }]}>
                  <MaterialCommunityIcons name={item.icon} size={22} color={item.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.essentialLabel}>{item.label}</Text>
                  <Text style={styles.essentialValue} numberOfLines={2}>
                    {item.value}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* Pro Tips – numbered */}
          <Text style={styles.sectionTitle}>Pro Tips</Text>

          <View style={styles.tipsCard}>
            {proTips.map((tip, index) => (
              <View
                key={tip}
                style={[
                  styles.tipRow,
                  index === proTips.length - 1 && { marginBottom: 0, borderBottomWidth: 0 },
                ]}
              >
                <View style={styles.tipNumber}>
                  <Text style={styles.tipNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </View>

          {/* Common Problems */}
          <Text style={styles.sectionTitle}>Common Problems</Text>

          {commonProblems.map((problem) => (
            <View key={problem.title} style={styles.problemCard}>
              <View style={[styles.problemAccent, { backgroundColor: problem.color }]} />
              <View style={[styles.problemIcon, { backgroundColor: `${problem.color}18` }]}>
                <MaterialCommunityIcons name={problem.icon} size={22} color={problem.color} />
              </View>
              <View style={styles.problemContent}>
                <Text style={styles.problemTitle}>{problem.title}</Text>
                <Text style={styles.problemFix}>{problem.fix}</Text>
              </View>
            </View>
          ))}

          <View style={{ height: 24 }} />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 6,
  },

  /* Header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: "rgba(46,125,50,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerCenter: {
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: "#2E7D32",
    letterSpacing: 0.3,
  },
  headerDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#2E7D32",
    marginTop: 4,
    opacity: 0.5,
  },
  headerRight: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: "rgba(46,125,50,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },

  content: {
    paddingBottom: 40,
  },

  /* Hero */
  heroWrap: {
    marginBottom: 28,
  },
  hero: {
    borderRadius: 24,
    padding: 20,
    overflow: "hidden",
    position: "relative",
  },
  heroContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 2,
  },
  heroTextBlock: {
    flex: 1,
    marginRight: 12,
  },
  heroLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "rgba(255,255,255,0.7)",
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#FFF",
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 13,
    color: "#E8F5E9",
  },
  heroImage: {
    width: 68,
    height: 68,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.35)",
  },
  heroIconCircle: {
    width: 68,
    height: 68,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroDecor1: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255,255,255,0.08)",
    top: -40,
    right: -30,
  },
  heroDecor2: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.06)",
    bottom: -20,
    left: 30,
  },

  /* Section */
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#2A2A2A",
    marginBottom: 12,
  },
  progressPill: {
    backgroundColor: "#2E7D32",
    borderRadius: 20,
    paddingHorizontal: 11,
    paddingVertical: 4,
    marginBottom: 12,
  },
  progressPillText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 12,
  },

  /* Progress bar */
  progressTrack: {
    height: 6,
    backgroundColor: "rgba(46,125,50,0.15)",
    borderRadius: 3,
    marginBottom: 14,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#2E7D32",
    borderRadius: 3,
  },

  /* Challenge */
  challengeCard: {
    backgroundColor: "#FFF",
    borderRadius: 22,
    padding: 16,
    marginBottom: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  taskRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderRadius: 14,
  },
  taskRowDone: {
    backgroundColor: "#F8FBF6",
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: "#43A047",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: "#43A047",
    borderColor: "#43A047",
  },
  taskIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "rgba(46,125,50,0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10,
  },
  taskText: {
    flex: 1,
    color: "#333",
    fontSize: 14,
    fontWeight: "500",
  },
  taskTextDone: {
    color: "#AAA",
    textDecorationLine: "line-through",
  },
  doneBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F5E9",
    borderRadius: 14,
    padding: 12,
    marginTop: 8,
  },
  doneText: {
    marginLeft: 8,
    color: "#2E7D32",
    fontWeight: "600",
    fontSize: 13,
    flex: 1,
  },

  /* Essentials */
  essentialsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 28,
  },
  essentialCard: {
    backgroundColor: "#FFF",
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  essentialWide: {
    width: "48%",
  },
  essentialNarrow: {
    width: "31%",
    flexDirection: "column",
    alignItems: "center",
    paddingVertical: 14,
  },
  essentialIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  essentialLabel: {
    fontSize: 11,
    color: "#888",
    fontWeight: "600",
    marginBottom: 2,
  },
  essentialValue: {
    fontSize: 13,
    fontWeight: "700",
    color: "#2A2A2A",
  },

  /* Tips */
  tipsCard: {
    backgroundColor: "#FFF",
    borderRadius: 22,
    padding: 8,
    marginBottom: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  tipRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  tipNumber: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "rgba(46,125,50,0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    marginTop: 1,
  },
  tipNumberText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#2E7D32",
  },
  tipText: {
    flex: 1,
    color: "#555",
    fontSize: 14,
    lineHeight: 21,
  },

  /* Problems */
  problemCard: {
    backgroundColor: "#FFF",
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  problemAccent: {
    width: 5,
    height: "100%",
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
  },
  problemIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 16,
    marginVertical: 14,
  },
  problemContent: {
    flex: 1,
    marginLeft: 12,
    marginRight: 14,
    paddingVertical: 14,
  },
  problemTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#2A2A2A",
    marginBottom: 3,
  },
  problemFix: {
    fontSize: 13,
    color: "#777",
    lineHeight: 18,
  },
});