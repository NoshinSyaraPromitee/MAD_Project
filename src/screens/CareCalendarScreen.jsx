import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import myPlants from "../data/myPlants";

export default function CareCalendarScreen({ navigation }) {
  const [doneTasks, setDoneTasks] = useState([]);

  const toggleTask = (taskId) => {
    setDoneTasks((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
    );
  };

  // Build a watering task + a fertilizer task per plant
  const tasks = myPlants.flatMap((plant) => [
    {
      id: `${plant.id}-water`,
      plant,
      type: "water",
      icon: "water",
      color: "#42A5F5",
      label: "Water",
      when: plant.waterLevel,
    },
    {
      id: `${plant.id}-fertilizer`,
      plant,
      type: "fertilizer",
      icon: "leaf",
      color: "#8D6E63",
      label: "Fertilize",
      when: plant.fertilizer,
    },
  ]);

  const groupLabel = (when) => {
    if (when === "Today") return "Today";
    if (when === "Tomorrow") return "Tomorrow";
    return "Later This Week";
  };

  const sections = ["Today", "Tomorrow", "Later This Week"].map(
    (section) => ({
      section,
      data: tasks.filter((task) => groupLabel(task.when) === section),
    })
  );

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
            Care Calendar
          </Text>

          <View style={{ width: 28 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {sections.map(({ section, data }) =>
            data.length === 0 ? null : (
              <View key={section} style={styles.section}>
                <Text style={styles.sectionTitle}>
                  {section}
                </Text>

                {data.map((task) => {
                  const isDone = doneTasks.includes(task.id);

                  return (
                    <TouchableOpacity
                      key={task.id}
                      style={styles.taskCard}
                      activeOpacity={0.85}
                      onPress={() => toggleTask(task.id)}
                    >
                      <View
                        style={[
                          styles.iconCircle,
                          { backgroundColor: `${task.color}22` },
                        ]}
                      >
                        <MaterialCommunityIcons
                          name={task.icon}
                          size={24}
                          color={task.color}
                        />
                      </View>

                      <View style={styles.taskInfo}>
                        <Text style={styles.taskTitle}>
                          {task.label} {task.plant.nickname}
                        </Text>

                        <Text style={styles.taskSubtitle}>
                          {task.plant.species} • {task.plant.location}
                        </Text>
                      </View>

                      <MaterialCommunityIcons
                        name={
                          isDone
                            ? "check-circle"
                            : "checkbox-blank-circle-outline"
                        }
                        size={26}
                        color={isDone ? "#43A047" : "#CCC"}
                      />
                    </TouchableOpacity>
                  );
                })}
              </View>
            )
          )}

          {tasks.every((task) => doneTasks.includes(task.id)) && (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons
                name="check-decagram"
                size={50}
                color="#43A047"
              />

              <Text style={styles.emptyText}>
                All caught up! Your plants thank you.
              </Text>
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

  section: {
    marginBottom: 24,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#777",
    marginBottom: 12,
    textTransform: "uppercase",
  },

  taskCard: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    elevation: 3,
  },

  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },

  taskInfo: {
    flex: 1,
    marginLeft: 14,
  },

  taskTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },

  taskSubtitle: {
    marginTop: 3,
    color: "#888",
    fontSize: 13,
  },

  emptyState: {
    alignItems: "center",
    marginTop: 40,
  },

  emptyText: {
    marginTop: 12,
    color: "#555",
    fontSize: 15,
    textAlign: "center",
  },
});