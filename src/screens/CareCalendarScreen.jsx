import React, { useState } from "react";
import { Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import AppScreen from "../components/AppScreen";
import AppCard from "../components/AppCard";
import SectionTitle from "../components/SectionTitle";
import myPlants from "../data/myPlants";
import { palette } from "../theme/colors";
import { inter } from "../theme/typography";
import { BULLET } from "../utils/format";
import { themed } from "../theme/themed";

export default function CareCalendarScreen() {
  const [doneTasks, setDoneTasks] = useState([]);

  const toggleTask = (taskId) => {
    setDoneTasks((prev) =>
      prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]
    );
  };

  // Build a watering task + a fertilizer task per plant
  const tasks = myPlants.flatMap((plant) => [
    {
      id: `${plant.id}-water`,
      plant,
      icon: "water",
      color: palette.waterBlue,
      label: "Water",
      when: plant.waterLevel,
    },
    {
      id: `${plant.id}-fertilizer`,
      plant,
      icon: "leaf",
      color: palette.brown,
      label: "Fertilize",
      when: plant.fertilizer,
    },
  ]);

  const groupLabel = (when) => {
    if (when === "Today") return "Today";
    if (when === "Tomorrow") return "Tomorrow";
    return "Later This Week";
  };

  const sections = ["Today", "Tomorrow", "Later This Week"].map((section) => ({
    section,
    data: tasks.filter((task) => groupLabel(task.when) === section),
  }));

  const allDone = tasks.every((task) => doneTasks.includes(task.id));

  return (
    <AppScreen title="Care Calendar" scroll>
      {allDone ? (
        <AppCard style={styles.doneCard}>
          <MaterialCommunityIcons name="check-decagram" size={44} color="#43A047" />
          <Text style={[inter(16, "700", palette.textDark), styles.doneText]}>
            All caught up! Your plants thank you.
          </Text>
        </AppCard>
      ) : null}

      {sections.map(({ section, data }) =>
        data.length === 0 ? null : (
          <View key={section}>
            <SectionTitle
              title={section}
              upper
              right={
                <View style={styles.countPill}>
                  <Text style={inter(12, "800", palette.accent)}>{data.length}</Text>
                </View>
              }
            />

            {data.map((task) => {
              const isDone = doneTasks.includes(task.id);
              return (
                <AppCard
                  key={task.id}
                  style={styles.taskCard}
                  padding={14}
                  onPress={() => toggleTask(task.id)}
                  color={isDone ? palette.greenCardFill : undefined}
                >
                  <View style={styles.row}>
                    <View style={[styles.iconCircle, { backgroundColor: `${task.color}26` }]}>
                      <MaterialCommunityIcons name={task.icon} size={24} color={task.color} />
                    </View>

                    <View style={styles.taskInfo}>
                      <Text
                        style={[
                          inter(15, "700", palette.textDark),
                          isDone && styles.strike,
                        ]}
                      >
                        {task.label} {task.plant.nickname}
                      </Text>
                      <Text style={[inter(12, "500", palette.textMuted), styles.sub]}>
                        {task.plant.species} {BULLET} {task.plant.location}
                      </Text>
                    </View>

                    <MaterialCommunityIcons
                      name={isDone ? "check-circle" : "checkbox-blank-circle-outline"}
                      size={28}
                      color={isDone ? "#43A047" : palette.accent}
                    />
                  </View>
                </AppCard>
              );
            })}
          </View>
        )
      )}
    </AppScreen>
  );
}

const styles = themed(() => ({
  doneCard: { alignItems: "center", marginTop: 12 },
  doneText: { marginTop: 10, textAlign: "center" },
  countPill: {
    minWidth: 28,
    height: 24,
    borderRadius: 12,
    paddingHorizontal: 8,
    backgroundColor: palette.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  taskCard: { marginBottom: 10 },
  row: { flexDirection: "row", alignItems: "center" },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  taskInfo: { flex: 1, marginLeft: 14 },
  sub: { marginTop: 3 },
  strike: { textDecorationLine: "line-through", color: palette.textMuted },
}));