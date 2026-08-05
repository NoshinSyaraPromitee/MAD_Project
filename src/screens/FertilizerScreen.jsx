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
  StatusBar,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import fertilizers from "../data/fertilizers";

const { width } = Dimensions.get("window");
const CARD_GAP = 14;
const CARD_WIDTH = (width - 40 - CARD_GAP) / 2; // 20px padding each side

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
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color="#2E7D32" />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Fertilizer Recipes</Text>
            <View style={styles.headerUnderline} />
          </View>

          <View style={styles.headerRight}>
            <MaterialCommunityIcons name="leaf" size={22} color="#2E7D32" />
          </View>
        </View>

        {/* Subtitle + count */}
        <View style={styles.subtitleRow}>
          <Text style={styles.subtitle}>
            Make fertilizer at home with kitchen scraps
          </Text>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{filtered.length}</Text>
          </View>
        </View>

        {/* Search */}
        <View style={styles.searchBox}>
          <MaterialCommunityIcons name="magnify" size={22} color="#2E7D32" />
          <TextInput
            placeholder="Search by name, nutrient, or ingredient..."
            placeholderTextColor="#A0A0A0"
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")} hitSlop={12}>
              <MaterialCommunityIcons name="close-circle" size={20} color="#BBB" />
            </TouchableOpacity>
          )}
        </View>

        {/* Grid */}
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <View style={styles.emptyIconWrap}>
                <MaterialCommunityIcons name="flask-outline" size={42} color="#2E7D32" />
              </View>
              <Text style={styles.emptyTitle}>No recipes found</Text>
              <Text style={styles.emptyText}>
                Nothing matches “{search}”. Try a different keyword.
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.85}
              onPress={() =>
                navigation.navigate("FertilizerDetails", { fertilizer: item })
              }
            >
              {/* Image */}
              <View style={styles.imageWrap}>
                <Image source={{ uri: item.image }} style={styles.image} />
                <View style={styles.nutrientBadge}>
                  <MaterialCommunityIcons name="sprout" size={10} color="#558B2F" />
                  <Text style={styles.nutrientText} numberOfLines={1}>
                    {item.nutrient}
                  </Text>
                </View>
              </View>

              {/* Info */}
              <View style={styles.info}>
                <Text style={styles.name} numberOfLines={2}>
                  {item.name}
                </Text>

                <View style={styles.purposeRow}>
                  <MaterialCommunityIcons name="target" size={12} color="#2E7D32" />
                  <Text style={styles.purpose} numberOfLines={1}>
                    {item.purpose}
                  </Text>
                </View>
              </View>
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
    paddingTop: 8,
  },

  /* Header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(46,125,50,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerCenter: {
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2E7D32",
    letterSpacing: 0.3,
  },
  headerUnderline: {
    marginTop: 4,
    width: 36,
    height: 3,
    borderRadius: 2,
    backgroundColor: "#2E7D32",
    opacity: 0.35,
  },
  headerRight: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(46,125,50,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },

  /* Subtitle */
  subtitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  subtitle: {
    flex: 1,
    color: "#777",
    fontSize: 13,
    lineHeight: 18,
    marginRight: 10,
  },
  countBadge: {
    backgroundColor: "#2E7D32",
    minWidth: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  countText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "700",
  },

  /* Search */
  searchBox: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 18,
    height: 52,
    borderWidth: 1,
    borderColor: "rgba(46,125,50,0.12)",
    shadowColor: "#2E7D32",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: "#333",
  },

  /* Grid */
  listContent: {
    paddingBottom: 40,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: CARD_GAP,
  },

  /* Card */
  card: {
    width: CARD_WIDTH,
    backgroundColor: "#FFF",
    borderRadius: 18,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  imageWrap: {
    position: "relative",
  },
  image: {
    width: "100%",
    height: CARD_WIDTH * 0.85,
    backgroundColor: "#F0F0F0",
  },
  nutrientBadge: {
    position: "absolute",
    bottom: 8,
    left: 8,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F8E9",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    maxWidth: "80%",
  },
  nutrientText: {
    marginLeft: 4,
    fontSize: 10,
    color: "#558B2F",
    fontWeight: "700",
  },
  info: {
    padding: 12,
    paddingTop: 10,
  },
  name: {
    fontSize: 14,
    fontWeight: "700",
    color: "#2A2A2A",
    marginBottom: 6,
    lineHeight: 18,
  },
  purposeRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  purpose: {
    marginLeft: 4,
    color: "#2E7D32",
    fontSize: 11,
    fontWeight: "600",
    flex: 1,
  },

  /* Empty */
  emptyState: {
    alignItems: "center",
    marginTop: 70,
    paddingHorizontal: 24,
  },
  emptyIconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(46,125,50,0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#444",
    marginBottom: 6,
  },
  emptyText: {
    color: "#888",
    textAlign: "center",
    fontSize: 14,
    lineHeight: 20,
  },
});