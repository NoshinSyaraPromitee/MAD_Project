import React from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import PlantCard from "../components/PlantCard";
import PlantBuddy from "../components/PlantBuddy";

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) {
    return "Good morning! Your plants missed you !!";
  }

  if (hour < 18) {
    return "Good afternoon! Time to check on your leafy friends ";
  }

  return "Good evening! One last peek before bed? ";
}

export default function HomeScreen({ navigation }) {
  return (
    <LinearGradient
      colors={["#FFF7E7", "#E8FFD8", "#FFF8EC"]}
      style={styles.container}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          <Header />

          <PlantBuddy message={getGreeting()} />

          <SearchBar />

          {/* Scan Banner */}

          <TouchableOpacity
            style={styles.banner}
            onPress={() => navigation.navigate("Scan")}
          >
            <View>
              <Text style={styles.bannerTitle}>
                Scan Your Plant
              </Text>

              <Text style={styles.bannerText}>
                Identify any plant with AI in seconds.
              </Text>
            </View>

            <MaterialCommunityIcons
              name="camera"
              size={55}
              color="#fff"
            />
          </TouchableOpacity>

          {/* Quick Actions */}

          <Text style={styles.sectionTitle}>
            Quick Actions
          </Text>

          <View style={styles.grid}>
            {[
              ["leaf", "Care Guide", "CareGuide"],
              ["robot", "AI Doctor", "AI Doctor"],
              ["cart", "Shop", "Shop"],
              ["flower", "My Plants", "MyPlants"],
              ["flask-outline", "Fertilizers", "FertilizerRecipes"],
            ].map(([icon, label, route]) => (
              <TouchableOpacity
                key={label}
                style={styles.actionCard}
                onPress={() => navigation.navigate(route)}
              >
                <MaterialCommunityIcons
                  name={icon}
                  size={32}
                  color="#2E7D32"
                />

                <Text style={styles.actionText}>
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionTitle}>
            Recent Plants
          </Text>

          <PlantCard />
          <PlantCard />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    padding: 20,
  },

  banner: {
    backgroundColor: "#4CAF50",

    borderRadius: 22,

    padding: 22,

    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",

    marginBottom: 25,
  },

  bannerTitle: {
    color: "#fff",

    fontSize: 22,

    fontWeight: "bold",
  },

  bannerText: {
    color: "#F1F1F1",

    marginTop: 8,

    width: 180,
  },

  sectionTitle: {
    fontSize: 20,

    fontWeight: "bold",

    color: "#333",

    marginBottom: 15,
  },

  grid: {
    flexDirection: "row",

    flexWrap: "wrap",

    justifyContent: "space-between",

    marginBottom: 30,
  },

  actionCard: {
    width: "47%",

    backgroundColor: "#fff",

    borderRadius: 18,

    alignItems: "center",

    paddingVertical: 22,

    marginBottom: 15,

    elevation: 3,
  },

  actionText: {
    marginTop: 10,

    fontWeight: "600",

    color: "#444",
  },
});