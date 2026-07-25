import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const defaultGuide = {
  species: "General Houseplant",
  water: "Twice a week",
  sunlight: "Bright indirect light",
  temperature: "20°C - 28°C",
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

export default function CareGuideScreen({ route, navigation }) {
  const plant = route?.params?.plant;

  const guide = plant
    ? {
        species: plant.species,
        water: plant.waterLevel,
        sunlight: plant.sunlight,
        temperature: "20°C - 28°C",
        fertilizer: plant.fertilizer,
        humidity: plant.humidity,
      }
    : defaultGuide;

  const essentials = [
    { icon: "water", color: "#42A5F5", label: "Water", value: guide.water },
    { icon: "white-balance-sunny", color: "#FFB300", label: "Sunlight", value: guide.sunlight },
    { icon: "thermometer", color: "#E53935", label: "Temperature", value: guide.temperature },
    { icon: "leaf", color: "#43A047", label: "Fertilizer", value: guide.fertilizer },
    { icon: "water-percent", color: "#00ACC1", label: "Humidity", value: guide.humidity },
  ];

  return (
    <LinearGradient
      colors={["#FFF7E7", "#E8FFD8", "#FFF8EC"]}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}

        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons
              name="arrow-left"
              size={28}
              color="#2E7D32"
            />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            Care Guide
          </Text>

          <View style={{ width: 28 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          {/* Hero */}

          <View style={styles.hero}>
            {plant ? (
              <Image
                source={{ uri: plant.image }}
                style={styles.heroImage}
              />
            ) : (
              <View style={styles.heroIconCircle}>
                <MaterialCommunityIcons
                  name="flower-tulip"
                  size={40}
                  color="white"
                />
              </View>
            )}

            <View style={{ flex: 1, marginLeft: 16 }}>
              <Text style={styles.heroTitle}>
                {plant ? plant.nickname : "Plant Care 101"}
              </Text>

              <Text style={styles.heroSubtitle}>
                {guide.species}
              </Text>
            </View>
          </View>

          {/* Essentials */}

          <Text style={styles.sectionTitle}>
            Essentials
          </Text>

          <View style={styles.grid}>
            {essentials.map((item) => (
              <View key={item.label} style={styles.essentialCard}>
                <View
                  style={[
                    styles.iconCircle,
                    { backgroundColor: `${item.color}22` },
                  ]}
                >
                  <MaterialCommunityIcons
                    name={item.icon}
                    size={24}
                    color={item.color}
                  />
                </View>

                <Text style={styles.essentialLabel}>
                  {item.label}
                </Text>

                <Text style={styles.essentialValue}>
                  {item.value}
                </Text>
              </View>
            ))}
          </View>

          {/* Pro Tips */}

          <Text style={styles.sectionTitle}>
            Pro Tips
          </Text>

          <View style={styles.tipsCard}>
            {proTips.map((tip, index) => (
              <View
                key={tip}
                style={[
                  styles.tipRow,
                  index === proTips.length - 1 && { marginBottom: 0 },
                ]}
              >
                <MaterialCommunityIcons
                  name="check-circle"
                  size={20}
                  color="#43A047"
                />

                <Text style={styles.tipText}>
                  {tip}
                </Text>
              </View>
            ))}
          </View>

          {/* Common Problems */}

          <Text style={styles.sectionTitle}>
            Common Problems
          </Text>

          {commonProblems.map((problem) => (
            <View key={problem.title} style={styles.problemCard}>
              <View
                style={[
                  styles.iconCircle,
                  { backgroundColor: `${problem.color}22` },
                ]}
              >
                <MaterialCommunityIcons
                  name={problem.icon}
                  size={24}
                  color={problem.color}
                />
              </View>

              <View style={{ flex: 1, marginLeft: 14 }}>
                <Text style={styles.problemTitle}>
                  {problem.title}
                </Text>

                <Text style={styles.problemFix}>
                  {problem.fix}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2E7D32",
  },

  content: {
    paddingBottom: 40,
  },

  hero: {
    backgroundColor: "#2E7D32",
    borderRadius: 22,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 26,
    elevation: 5,
  },

  heroImage: {
    width: 60,
    height: 60,
    borderRadius: 16,
  },

  heroIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },

  heroTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },

  heroSubtitle: {
    marginTop: 4,
    color: "#E8F5E9",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 14,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 26,
  },

  essentialCard: {
    width: "31%",
    backgroundColor: "white",
    borderRadius: 18,
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 6,
    marginBottom: 12,
    elevation: 3,
  },

  iconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: "center",
    alignItems: "center",
  },

  essentialLabel: {
    marginTop: 10,
    fontSize: 12,
    color: "#888",
    fontWeight: "600",
  },

  essentialValue: {
    marginTop: 3,
    fontSize: 13,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },

  tipsCard: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 18,
    marginBottom: 26,
    elevation: 3,
  },

  tipRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 14,
  },

  tipText: {
    flex: 1,
    marginLeft: 10,
    color: "#555",
    lineHeight: 20,
  },

  problemCard: {
    backgroundColor: "white",
    borderRadius: 18,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    elevation: 3,
  },

  problemTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#333",
  },

  problemFix: {
    marginTop: 3,
    color: "#777",
    fontSize: 13,
    lineHeight: 18,
  },
});