import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import HealthBadge from "./HealthBadge";

export default function PlantStatusCard({
  plant,
  navigation,
}) {
  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.9}
      onPress={() =>
        navigation.navigate("PlantDetails", {
          plant,
        })
      }
    >
      <Image
        source={{ uri: plant.image }}
        style={styles.image}
      />

      <View style={styles.info}>
        <Text style={styles.nickname}>
          {plant.nickname}
        </Text>

        <Text style={styles.species}>
          {plant.species}
        </Text>

        <HealthBadge health={plant.health} />

        <View style={styles.row}>
          <MaterialCommunityIcons
            name="water"
            size={18}
            color="#42A5F5"
          />

          <Text style={styles.detail}>
            {plant.waterLevel}
          </Text>
        </View>

        <View style={styles.row}>
          <MaterialCommunityIcons
            name="map-marker"
            size={18}
            color="#43A047"
          />

          <Text style={styles.detail}>
            {plant.location}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 25,
    marginBottom: 18,
    flexDirection: "row",
    padding: 15,
    elevation: 4,
  },

  image: {
    width: 100,
    height: 100,
    borderRadius: 20,
  },

  info: {
    flex: 1,
    marginLeft: 15,
  },

  nickname: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2E7D32",
  },

  species: {
    color: "#777",
    marginBottom: 10,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },

  detail: {
    marginLeft: 8,
    color: "#555",
  },
});