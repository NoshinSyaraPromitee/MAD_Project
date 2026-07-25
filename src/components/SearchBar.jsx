import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function SearchBar() {
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons
        name="magnify"
        size={22}
        color="#777"
      />

      <TextInput
        placeholder="Search plants..."
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",

    flexDirection: "row",

    alignItems: "center",

    paddingHorizontal: 15,

    borderRadius: 15,

    height: 55,

    elevation: 3,

    marginBottom: 25,
  },

  input: {
    flex: 1,

    marginLeft: 10,

    fontSize: 16,
  },
});