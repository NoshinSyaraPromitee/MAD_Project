// ===============================
// src/screens/ScanPlantScreen.jsx
// ===============================

import React from "react";
import { Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import AppScreen from "../components/AppScreen";
import AppButton from "../components/AppButton";
import { palette, creamA } from "../theme/colors";
import { inter } from "../theme/typography";
import { shadow } from "../theme/theme";
import { themed } from "../theme/themed";

export default function ScanPlantScreen({ navigation }) {
  return (
    <AppScreen title="Scan Your Plant" showBack={false} edges={["top"]}>
      <View style={styles.center}>
        <View style={styles.ringOuter}>
          <View style={styles.circle}>
            <MaterialCommunityIcons name="camera" size={84} color={palette.accent} />
          </View>
        </View>

        <Text style={[inter(15, "700", palette.cream), styles.hint]}>
          Snap a clear photo of a leaf or the whole plant and let the AI do the rest.
        </Text>

        <AppButton
          label="Open Camera"
          rightIcon="camera"
          onPress={() => navigation.navigate("ScanResult")}
          style={styles.button}
        />
      </View>
    </AppScreen>
  );
}

const styles = themed(() => ({
  center: { flex: 1, alignItems: "center", justifyContent: "center", paddingBottom: 24 },
  ringOuter: {
    width: 236,
    height: 236,
    borderRadius: 118,
    borderWidth: 2,
    borderColor: creamA(0.6),
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },
  circle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: palette.surface,
    alignItems: "center",
    justifyContent: "center",
    ...shadow(8, 0.3),
  },
  hint: { textAlign: "center", marginTop: 28, paddingHorizontal: 12, lineHeight: 21 },
  button: { marginTop: 28, alignSelf: "stretch" },
}));