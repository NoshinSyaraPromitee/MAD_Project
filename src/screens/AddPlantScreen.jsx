import React, { useState } from "react";
import { Alert, Pressable, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import AppScreen from "../components/AppScreen";
import AppTextField from "../components/AppTextField";
import AppButton from "../components/AppButton";
import { palette } from "../theme/colors";
import { inter } from "../theme/typography";
import { themed } from "../theme/themed";

export default function AddPlantScreen({ navigation }) {
  const [nickname, setNickname] = useState("");
  const [species, setSpecies] = useState("");
  const [location, setLocation] = useState("");
  const [sunlight, setSunlight] = useState("");
  const [watering, setWatering] = useState("");

  const handleSave = () => {
    if (!nickname || !species) {
      Alert.alert(
        "Missing Information",
        "Please enter at least the plant nickname and species."
      );
      return;
    }

    // Later this will save to Context or Firebase
    Alert.alert("Plant Added \uD83C\uDF31", `${nickname} has been added to your collection!`, [
      { text: "OK", onPress: () => navigation.goBack() },
    ]);
  };

  const label = (text) => <Text style={[inter(15, "700", palette.cream), styles.label]}>{text}</Text>;

  return (
    <AppScreen title="Add Plant" scroll>
      <Pressable style={({ pressed }) => [styles.photoCard, pressed && { opacity: 0.9 }]}>
        <MaterialCommunityIcons name="camera-plus-outline" size={56} color={palette.accent} />
        <Text style={[inter(16, "700", palette.accent), styles.photoText]}>Add Plant Photo</Text>
      </Pressable>

      {label("Nickname")}
      <AppTextField icon="tag-heart-outline" placeholder="Bella" value={nickname} onChangeText={setNickname} />

      {label("Plant Species")}
      <AppTextField icon="leaf" placeholder="Monstera Deliciosa" value={species} onChangeText={setSpecies} />

      {label("Location")}
      <AppTextField icon="map-marker-outline" placeholder="Living Room" value={location} onChangeText={setLocation} />

      {label("Sunlight")}
      <AppTextField icon="white-balance-sunny" placeholder="Medium" value={sunlight} onChangeText={setSunlight} />

      {label("Watering Schedule")}
      <AppTextField icon="water-outline" placeholder="Every 3 Days" value={watering} onChangeText={setWatering} />

      <AppButton
        label="Auto Fill Using AI Scan"
        leftIcon="robot-outline"
        variant="outline"
        onPress={() => navigation.navigate("MainTabs", { screen: "Scan" })}
        style={styles.aiButton}
      />

      <AppButton
        label="Save Plant"
        leftIcon="content-save-outline"
        onPress={handleSave}
        style={styles.saveButton}
      />
    </AppScreen>
  );
}

const styles = themed(() => ({
  photoCard: {
    height: 190,
    marginTop: 10,
    marginBottom: 20,
    borderRadius: 24,
    backgroundColor: palette.surface,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: palette.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  photoText: { marginTop: 12 },
  label: { marginBottom: 8, marginLeft: 4 },
  aiButton: { marginTop: 8 },
  saveButton: { marginTop: 14 },
}));