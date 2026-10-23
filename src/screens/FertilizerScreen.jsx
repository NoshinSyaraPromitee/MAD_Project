import React, { useState } from "react";
import { FlatList, Image, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import AppScreen from "../components/AppScreen";
import AppCard from "../components/AppCard";
import SearchBar from "../components/SearchBar";
import EmptyView from "../components/EmptyView";
import fertilizers from "../data/fertilizers";
import { palette, tealA } from "../theme/colors";
import { inter } from "../theme/typography";
import { themed } from "../theme/themed";

export default function FertilizerScreen({ navigation }) {
  const [search, setSearch] = useState("");
  const query = search.toLowerCase().trim();

  const filtered = fertilizers.filter((item) => {
    if (!query) return true;
    return (
      item.name.toLowerCase().includes(query) ||
      item.purpose.toLowerCase().includes(query) ||
      item.nutrient.toLowerCase().includes(query) ||
      item.ingredients.some((ing) => ing.toLowerCase().includes(query))
    );
  });

  return (
    <AppScreen title="Fertilizer Recipes">
      <View style={styles.subtitleRow}>
     
        <View style={styles.countBadge}>
          <Text style={inter(12, "800", palette.cream)}>{filtered.length}</Text>
        </View>
      </View>

      <SearchBar
        value={search}
        onChangeText={setSearch}
        placeholder="Search by name, nutrient, or ingredient..."
      />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.column}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <EmptyView
            icon="flask-outline"
            title="No recipes found"
            subtitle={`Nothing matches "${search}". Try a different keyword.`}
            light
          />
        }
        renderItem={({ item }) => (
          <AppCard
            padding={0}
            style={styles.card}
            onPress={() => navigation.navigate("FertilizerDetails", { fertilizer: item })}
          >
            <View>
              <Image source={{ uri: item.image }} style={styles.image} />
              <View style={styles.nutrient}>
                <MaterialCommunityIcons name="sprout" size={11} color={palette.accent} />
                <Text style={[inter(10, "800", palette.accent), styles.ml4]} numberOfLines={1}>
                  {item.nutrient}
                </Text>
              </View>
            </View>

            <View style={styles.info}>
              <Text style={[inter(14, "700", palette.textDark), styles.name]} numberOfLines={2}>
                {item.name}
              </Text>
              <View style={styles.row}>
                <MaterialCommunityIcons name="target" size={12} color={palette.accent} />
                <Text style={[inter(11, "600", palette.accent), styles.ml4, styles.flex]} numberOfLines={1}>
                  {item.purpose}
                </Text>
              </View>
            </View>
          </AppCard>
        )}
      />
    </AppScreen>
  );
}

const styles = themed(() => ({
  flex: { flex: 1 },
  row: { flexDirection: "row", alignItems: "center" },
  ml4: { marginLeft: 4 },
  subtitleRow: { flexDirection: "row", alignItems: "center", marginTop: 4, marginBottom: 12 },
  countBadge: {
    minWidth: 30,
    height: 30,
    borderRadius: 15,
    paddingHorizontal: 8,
    marginLeft: 10,
    backgroundColor: palette.teal,
    borderWidth: 1.5,
    borderColor: palette.cream,
    alignItems: "center",
    justifyContent: "center",
  },
  list: { paddingBottom: 32 },
  column: { justifyContent: "space-between", marginBottom: 12 },
  card: { width: "48.5%", overflow: "hidden" },
  image: {
    width: "100%",
    height: 130,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    backgroundColor: tealA(0.08),
  },
  nutrient: {
    position: "absolute",
    left: 8,
    bottom: 8,
    maxWidth: "85%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: palette.surface,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  info: { padding: 12 },
  name: { marginBottom: 6, minHeight: 36 },
}));