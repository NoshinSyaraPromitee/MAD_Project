import React from "react";
import { Image, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import AppCard from "./AppCard";
import HealthBadge, { healthInfo } from "./HealthBadge";
import { palette } from "../theme/colors";
import { inter } from "../theme/typography";
import { themed } from "../theme/themed";

export default function PlantStatusCard({ plant, navigation }) {
  const ring = healthInfo(plant.health).color;

  return (
    <AppCard
      style={styles.card}
      padding={14}
      onPress={() => navigation.navigate("PlantDetails", { plant })}
    >
      <View style={styles.row}>
        <View style={[styles.imageRing, { borderColor: ring }]}>
          <Image source={{ uri: plant.image }} style={styles.image} />
        </View>

        <View style={styles.info}>
          <Text style={inter(18, "800", palette.textDark)} numberOfLines={1}>
            {plant.nickname}
          </Text>
          <Text style={[inter(13, "500", palette.textMuted), styles.species]} numberOfLines={1}>
            {plant.species}
          </Text>

          <HealthBadge health={plant.health} />

          <View style={styles.metaRow}>
            <View style={styles.meta}>
              <MaterialCommunityIcons name="water" size={16} color={palette.waterBlue} />
              <Text style={[inter(12, "600", palette.textDark), styles.metaText]}>
                {plant.waterLevel}
              </Text>
            </View>
            <View style={styles.meta}>
              <MaterialCommunityIcons name="map-marker" size={16} color={palette.accent} />
              <Text style={[inter(12, "600", palette.textDark), styles.metaText]} numberOfLines={1}>
                {plant.location}
              </Text>
            </View>
          </View>
        </View>

        <MaterialCommunityIcons name="chevron-right" size={26} color={palette.accent} />
      </View>
    </AppCard>
  );
}

const styles = themed(() => ({
  card: { marginBottom: 14 },
  row: { flexDirection: "row", alignItems: "center" },
  imageRing: {
    width: 92,
    height: 92,
    borderRadius: 22,
    borderWidth: 3,
    padding: 2,
  },
  image: { width: "100%", height: "100%", borderRadius: 18 },
  info: { flex: 1, marginLeft: 14 },
  species: { marginBottom: 8 },
  metaRow: { flexDirection: "row", marginTop: 8, flexWrap: "wrap" },
  meta: { flexDirection: "row", alignItems: "center", marginRight: 14 },
  metaText: { marginLeft: 4 },
}));