import React from "react";
import { Image, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import AppScreen from "../components/AppScreen";
import AppCard from "../components/AppCard";
import EmptyView from "../components/EmptyView";
import myPlants from "../data/myPlants";
import { palette, creamA } from "../theme/colors";
import { inter } from "../theme/typography";
import { shadow } from "../theme/theme";
import { BULLET } from "../utils/format";
import { themed } from "../theme/themed";

const getActionMeta = () => ({
  scan: { icon: "leaf-maple", color: palette.accent, label: "AI Scan" },
  water: { icon: "water", color: palette.waterBlue, label: "Watered" },
  fertilize: { icon: "flask", color: palette.brown, label: "Fertilized" },
});

// Build a simple activity log from each plant's known fields.
function buildHistory() {
  return myPlants.flatMap((plant) => [
    {
      id: `${plant.id}-scan`,
      plant,
      action: "scan",
      when: plant.lastScan,
      note: `${plant.status} ${BULLET} ${plant.health}% health`,
    },
    {
      id: `${plant.id}-water`,
      plant,
      action: "water",
      when: plant.lastWatered,
      note: `Next watering ${plant.nextWatering}`,
    },
  ]);
}

export default function PlantHistoryScreen({ navigation }) {
  const history = buildHistory();
  const actionMeta = getActionMeta();

  return (
    <AppScreen title="Plant History" scroll>
      {history.length === 0 ? (
        <EmptyView icon="history" title="No activity yet" subtitle="Scan a plant to get started!" />
      ) : (
        <View style={styles.timeline}>
          {history.map((entry, index) => {
            const meta = actionMeta[entry.action];
            const isLast = index === history.length - 1;

            return (
              <View key={entry.id} style={styles.entryRow}>
                <View style={styles.track}>
                  <View style={[styles.dot, { backgroundColor: meta.color }]}>
                    <MaterialCommunityIcons name={meta.icon} size={16} color={palette.white} />
                  </View>
                  {!isLast ? <View style={styles.line} /> : null}
                </View>

                <AppCard
                  style={styles.card}
                  padding={12}
                  onPress={() => navigation.navigate("PlantDetails", { plant: entry.plant })}
                >
                  <View style={styles.row}>
                    <Image source={{ uri: entry.plant.image }} style={styles.thumb} />
                    <View style={styles.info}>
                      <Text style={inter(15, "700", palette.textDark)} numberOfLines={1}>
                        {meta.label} {BULLET} {entry.plant.nickname}
                      </Text>
                      <Text style={[inter(13, "500", palette.textMuted), styles.note]} numberOfLines={1}>
                        {entry.note}
                      </Text>
                      <Text style={[inter(12, "700", meta.color), styles.when]}>{entry.when}</Text>
                    </View>
                  </View>
                </AppCard>
              </View>
            );
          })}
        </View>
      )}
    </AppScreen>
  );
}

const styles = themed(() => ({
  timeline: { marginTop: 10 },
  entryRow: { flexDirection: "row" },
  track: { alignItems: "center", width: 36 },
  dot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: palette.cream,
    alignItems: "center",
    justifyContent: "center",
    ...shadow(3),
  },
  line: { width: 2, flex: 1, backgroundColor: creamA(0.6), marginVertical: 4 },
  card: { flex: 1, marginLeft: 12, marginBottom: 14 },
  row: { flexDirection: "row", alignItems: "center" },
  thumb: { width: 56, height: 56, borderRadius: 14 },
  info: { flex: 1, marginLeft: 12 },
  note: { marginTop: 3 },
  when: { marginTop: 4 },
}));