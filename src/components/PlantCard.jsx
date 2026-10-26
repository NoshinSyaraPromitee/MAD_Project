import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function PlantCard() {
  return (
    <View style={styles.card}>
      <MaterialCommunityIcons
        name="flower"
        size={45}
        color="#2E7D32"
      />

      <View style={styles.info}>
        <Text style={styles.name}>Snake Plant</Text>

        <Text style={styles.status}>
          Water Tomorrow
        </Text>
      </View>

      <TouchableOpacity>
        <MaterialCommunityIcons
          name="chevron-right"
          size={30}
          color="#2E7D32"
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",

    flexDirection: "row",

    alignItems: "center",

    borderRadius: 20,

    padding: 18,

    marginBottom: 15,

    elevation: 4,
  },

  info: {
    flex: 1,

    marginLeft: 15,
  },

  name: {
    fontSize: 18,

    fontWeight: "bold",

    color: "#333",
  },

  status: {
    color: "#777",

    marginTop: 5,
  },
});