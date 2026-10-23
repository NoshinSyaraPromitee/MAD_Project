import React, { useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import AppScreen from "../components/AppScreen";
import AppCard from "../components/AppCard";
import SearchBar from "../components/SearchBar";
import EmptyView from "../components/EmptyView";
import PlantStatusCard from "../components/PlantStatusCard";
import myPlants from "../data/myPlants";
import { palette } from "../theme/colors";
import { inter } from "../theme/typography";
import { shadow } from "../theme/theme";
import { themed } from "../theme/themed";

export default function MyPlantsScreen({ navigation }) {
  const [search, setSearch] = useState("");
  const [waterOnly, setWaterOnly] = useState(false);

  const q = search.toLowerCase();
  const filteredPlants = myPlants.filter(
    (plant) =>
      (!waterOnly || plant.waterLevel === "Today") &&
      (plant.nickname.toLowerCase().includes(q) || plant.species.toLowerCase().includes(q))
  );

  const averageHealth = myPlants.length
    ? Math.round(myPlants.reduce((sum, plant) => sum + plant.health, 0) / myPlants.length)
    : 0;

  const needsWater = myPlants.filter((plant) => plant.waterLevel === "Today").length;

  const stat = (value, label, color, onPress, selected) => (
    <AppCard
      style={styles.stat}
      padding={12}
      onPress={onPress}
      color={selected ? palette.greenCardFill : undefined}
    >
      <Text style={[inter(22, "800", color), styles.centerText]}>{value}</Text>
      <Text
        style={[inter(12, selected ? "700" : "600", palette.textMuted), styles.centerText]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </AppCard>
  );

  return (
    <AppScreen
      title="My Green Family"
      trailing={
        <Pressable
          style={({ pressed }) => [styles.addButton, pressed && { opacity: 0.85 }]}
          onPress={() => navigation.navigate("AddPlant")}
        >
          <MaterialCommunityIcons name="plus" color={palette.cream} size={26} />
        </Pressable>
      }
    >
      <SearchBar value={search} onChangeText={setSearch} style={styles.search} />

      <View style={styles.statsRow}>
        {stat(myPlants.length, "Plants", palette.accent)}
        {stat(`${averageHealth}%`, "Health", "#43A047")}
        {stat(
          needsWater,
          "Water Today",
          needsWater > 0 ? palette.waterBlue : palette.textMuted,
          () => setWaterOnly((v) => !v),
          waterOnly
        )}
      </View>

      <Text style={[inter(13, "700", palette.cream), styles.count]}>
        {filteredPlants.length} {filteredPlants.length === 1 ? "plant" : "plants"}
        {waterOnly ? " need water today" : ""}
      </Text>

      <FlatList
        data={filteredPlants}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => <PlantStatusCard plant={item} navigation={navigation} />}
        ListEmptyComponent={
          <EmptyView
            icon="filter-variant-remove"
            title="No matching plants"
            subtitle="Try a different name or clear the filter."
            light
          />
        }
      />
    </AppScreen>
  );
}

const styles = themed(() => ({
  search: { marginTop: 6 },
  statsRow: { flexDirection: "row", gap: 8, marginBottom: 6 },
  stat: { flex: 1, alignItems: "center" },
  centerText: { textAlign: "center" },
  count: { marginTop: 10, marginBottom: 10, marginLeft: 4 },
  list: { paddingBottom: 40 },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: palette.teal,
    borderWidth: 2,
    borderColor: palette.cream,
    alignItems: "center",
    justifyContent: "center",
    ...shadow(4),
  },
}));