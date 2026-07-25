import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import fertilizers from "../data/fertilizers";

export default function FertilizerScreen({ navigation }) {
  const [search, setSearch] = useState("");

  const query = search.toLowerCase().trim();

  const filtered = fertilizers.filter((item) => {
    if (!query) return true;

    const inName = item.name.toLowerCase().includes(query);
    const inPurpose = item.purpose.toLowerCase().includes(query);
    const inNutrient = item.nutrient.toLowerCase().includes(query);
    const inIngredients = item.ingredients.some((ing) =>
      ing.toLowerCase().includes(query)
    );

    return inName || inPurpose || inNutrient || inIngredients;
  });

  return (
    <LinearGradient
      colors={["#FFF7E7", "#E8FFD8", "#FFF8EC"]}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}

        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons
              name="arrow-left"
              size={28}
              color="#2E7D32"
            />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            Fertilizer Recipes
          </Text>

          <View style={{ width: 28 }} />
        </View>

        <Text style={styles.subtitle}>
          Homemade organic fertilizers using kitchen scraps
        </Text>

        {/* Search */}

        <View style={styles.searchBox}>
          <MaterialCommunityIcons name="magnify" size={22} color="#888" />

          <TextInput
            placeholder="Search by name, nutrient, or ingredient..."
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
          />

          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <MaterialCommunityIcons
                name="close-circle"
                size={20}
                color="#BBB"
              />
            </TouchableOpacity>
          )}
        </View>

        {/* List */}

        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <MaterialCommunityIcons
                name="flask-outline"
                size={46}
                color="#AAA"
              />

              <Text style={styles.emptyText}>
                No recipes match "{search}"
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.88}
              onPress={() =>
                navigation.navigate("FertilizerDetails", {
                  fertilizer: item,
                })
              }
            >
              <Image source={{ uri: item.image }} style={styles.image} />

              <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>

                <View style={styles.purposeRow}>
                  <MaterialCommunityIcons
                    name="target"
                    size={14}
                    color="#2E7D32"
                  />

                  <Text style={styles.purpose}>{item.purpose}</Text>
                </View>

                <View style={styles.tagRow}>
                  <View style={styles.tag}>
                    <Text style={styles.tagText}>{item.nutrient}</Text>
                  </View>
                </View>
              </View>

              <MaterialCommunityIcons
                name="chevron-right"
                size={22}
                color="#BBB"
              />
            </TouchableOpacity>
          )}
        />
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2E7D32",
  },

  subtitle: {
    color: "#888",
    marginBottom: 16,
  },

  searchBox: {
    backgroundColor: "white",
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    marginBottom: 20,
    height: 55,
  },

  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
  },

  card: {
    backgroundColor: "white",
    borderRadius: 20,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    elevation: 3,
  },

  image: {
    width: 64,
    height: 64,
    borderRadius: 14,
    backgroundColor: "#EEE",
  },

  info: {
    flex: 1,
    marginLeft: 14,
  },

  name: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#333",
  },

  purposeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },

  purpose: {
    marginLeft: 5,
    color: "#2E7D32",
    fontSize: 12,
    fontWeight: "600",
  },

  tagRow: {
    flexDirection: "row",
    marginTop: 8,
  },

  tag: {
    backgroundColor: "#F1F8E9",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },

  tagText: {
    fontSize: 11,
    color: "#558B2F",
    fontWeight: "600",
  },

  emptyState: {
    alignItems: "center",
    marginTop: 60,
  },

  emptyText: {
    marginTop: 12,
    color: "#777",
    textAlign: "center",
    paddingHorizontal: 30,
  },
});