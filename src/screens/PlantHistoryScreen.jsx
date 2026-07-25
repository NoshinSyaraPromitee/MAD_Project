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

import myPlants from "../data/myPlants";

const actionMeta = {
  scan: { icon: "leaf-maple", color: "#2E7D32", label: "AI Scan" },
  water: { icon: "water", color: "#42A5F5", label: "Watered" },
  fertilize: { icon: "flask", color: "#8D6E63", label: "Fertilized" },
};

// Build a simple activity log from each plant's known fields.
function buildHistory() {
  const entries = myPlants.flatMap((plant) => [
    {
      id: `${plant.id}-scan`,
      plant,
      action: "scan",
      when: plant.lastScan,
      note: `${plant.status} • ${plant.health}% health`,
    },
    {
      id: `${plant.id}-water`,
      plant,
      action: "water",
      when: plant.lastWatered,
      note: `Next watering ${plant.nextWatering}`,
    },
  ]);

  return entries;
}

export default function PlantHistoryScreen({ navigation }) {
  const history = buildHistory();

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
            Plant History
          </Text>

          <View style={{ width: 28 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {history.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons
                name="history"
                size={50}
                color="#AAA"
              />

              <Text style={styles.emptyText}>
                No activity yet. Scan a plant to get started!
              </Text>
            </View>
          ) : (
            <View style={styles.timeline}>
              {history.map((entry, index) => {
                const meta = actionMeta[entry.action];
                const isLast = index === history.length - 1;

                return (
                  <TouchableOpacity
                    key={entry.id}
                    style={styles.entryRow}
                    activeOpacity={0.85}
                    onPress={() =>
                      navigation.navigate("PlantDetails", {
                        plant: entry.plant,
                      })
                    }
                  >
                    <View style={styles.trackColumn}>
                      <View
                        style={[
                          styles.dot,
                          { backgroundColor: meta.color },
                        ]}
                      >
                        <MaterialCommunityIcons
                          name={meta.icon}
                          size={16}
                          color="white"
                        />
                      </View>

                      {!isLast && <View style={styles.line} />}
                    </View>

                    <View style={styles.card}>
                      <Image
                        source={{ uri: entry.plant.image }}
                        style={styles.thumb}
                      />

                      <View style={styles.info}>
                        <Text style={styles.title}>
                          {meta.label} • {entry.plant.nickname}
                        </Text>

                        <Text style={styles.note}>
                          {entry.note}
                        </Text>

                        <Text style={styles.when}>
                          {entry.when}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
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

  timeline: {
    marginTop: 5,
  },

  entryRow: {
    flexDirection: "row",
  },

  trackColumn: {
    alignItems: "center",
    width: 36,
  },

  dot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },

  line: {
    width: 2,
    flex: 1,
    backgroundColor: "#DDD",
    marginTop: 4,
    marginBottom: 4,
  },

  card: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 18,
    padding: 14,
    marginLeft: 12,
    marginBottom: 16,
    flexDirection: "row",
    elevation: 3,
  },

  thumb: {
    width: 55,
    height: 55,
    borderRadius: 14,
  },

  info: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
  },

  title: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },

  note: {
    marginTop: 3,
    color: "#777",
    fontSize: 13,
  },

  when: {
    marginTop: 4,
    color: "#43A047",
    fontSize: 12,
    fontWeight: "600",
  },

  emptyState: {
    alignItems: "center",
    marginTop: 60,
  },

  emptyText: {
    marginTop: 12,
    color: "#555",
    fontSize: 15,
    textAlign: "center",
    paddingHorizontal: 30,
  },
});