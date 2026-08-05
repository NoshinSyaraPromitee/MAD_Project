import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  FlatList,
  TouchableOpacity,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import myPlants from "../data/myPlants";
import PlantStatusCard from "../components/PlantStatusCard";

export default function MyPlantsScreen({ navigation }) {
  const [search, setSearch] = useState("");

  const filteredPlants = myPlants.filter(
    (plant) =>
      plant.nickname
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      plant.species
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  const averageHealth = Math.round(
    myPlants.reduce((sum, plant) => sum + plant.health, 0) /
      myPlants.length
  );

  const needsWater = myPlants.filter(
    (plant) => plant.waterLevel === "Today"
  ).length;

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

  <Text style={styles.greeting}>My Green Family</Text>

  <TouchableOpacity
    style={styles.addButton}
    onPress={() => navigation.navigate("AddPlant")}
  >
    <MaterialCommunityIcons name="plus" color="white" size={26} />
  </TouchableOpacity>
</View>

        {/* Search */}

        <View style={styles.searchBox}>
          <MaterialCommunityIcons
            name="magnify"
            size={22}
            color="#888"
          />

          <TextInput
            placeholder="Search plants..."
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Statistics */}

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
          

            <Text style={styles.number}>
              {myPlants.length}
            </Text>

            <Text style={styles.label}>
              Plants
            </Text>
          </View>

          <View style={styles.statCard}>
          

            <Text style={styles.number}>
              {averageHealth}%
            </Text>

            <Text style={styles.label}>
              Health
            </Text>
          </View>

          <View style={styles.statCard}>
          

            <Text style={styles.number}>
              {needsWater}
            </Text>

            <Text style={styles.label}>
              Water Today
            </Text>
          </View>
        </View>

        {/* Plants */}

        <FlatList
          data={filteredPlants}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 40,
          }}
          renderItem={({ item }) => (
            <PlantStatusCard
              plant={item}
              navigation={navigation}
            />
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
    paddingTop: 15,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  greeting: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2E7D32",
  },

  subtitle: {
    color: "#777",
    marginTop: 5,
  },

  addButton: {
    width: 55,
    height: 55,
    borderRadius: 28,
    backgroundColor: "#2E7D32",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
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
    fontSize: 16,
  },

  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  statCard: {
    backgroundColor: "white",
    width: "31%",
    borderRadius: 18,
    alignItems: "center",
    paddingVertical: 18,
    elevation: 4,
  },

  number: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
    color: "#2E7D32",
  },

  label: {
    color: "#777",
    marginTop: 5,
    fontSize: 13,
    textAlign: "center",
  },
});