import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import myPlants from "../data/myPlants";
import { CartContext } from "../context/CartContext";

const achievements = [
  { icon: "seed", label: "First Sprout", unlocked: true },
  { icon: "water", label: "Hydration Hero", unlocked: true },
  { icon: "leaf", label: "Green Thumb", unlocked: true },
  { icon: "camera", label: "Scan Master", unlocked: true },
  { icon: "trophy", label: "Plant Legend", unlocked: false },
];

const menuItems = [
  { icon: "flower", label: "My Plants", route: "MyPlants", color: "#43A047" },
  { icon: "calendar-check", label: "Care Calendar", route: "CareCalendar", color: "#42A5F5" },
  { icon: "flask-outline", label: "Fertilizer Recipes", route: "FertilizerRecipes", color: "#8BC34A" },
  { icon: "history", label: "Plant History", route: "PlantHistory", color: "#8D6E63" },
  { icon: "cart", label: "My Cart", route: "Cart", color: "#FB8C00" },
  { icon: "cog", label: "Settings", route: "Settings", color: "#757575" },
];

export default function ProfileScreen({ navigation }) {
  const { cartItems } = useContext(CartContext);

  const averageHealth = myPlants.length
    ? Math.round(
        myPlants.reduce((sum, plant) => sum + plant.health, 0) /
          myPlants.length
      )
    : 0;

  const handleLogout = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Log Out",
          style: "destructive",
          onPress: () =>
            navigation.reset({
              index: 0,
              routes: [{ name: "Landing" }],
            }),
        },
      ]
    );
  };

  return (
    <LinearGradient
      colors={["#FFF7E7", "#E8FFD8", "#FFF8EC"]}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {/* Header */}

          <View style={styles.header}>
            <Text style={styles.headerTitle}>
              Profile
            </Text>

            <TouchableOpacity
              onPress={() => navigation.navigate("Settings")}
            >
              <MaterialCommunityIcons
                name="cog-outline"
                size={26}
                color="#2E7D32"
              />
            </TouchableOpacity>
          </View>

          {/* Avatar Card */}

          <View style={styles.avatarCard}>
            <View style={styles.avatarWrap}>
              <View style={styles.avatar}>
                <MaterialCommunityIcons
                  name="sprout"
                  size={48}
                  color="white"
                />
              </View>

              <TouchableOpacity style={styles.editBadge}>
                <MaterialCommunityIcons
                  name="pencil"
                  size={14}
                  color="white"
                />
              </TouchableOpacity>
            </View>

            <Text style={styles.name}>
              Noshin
            </Text>

            <Text style={styles.subtitle}>
              🌿 Plant Parent since 2026
            </Text>
          </View>

          {/* Stats */}

          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <MaterialCommunityIcons
                name="flower"
                size={26}
                color="#2E7D32"
              />

              <Text style={styles.statNumber}>
                {myPlants.length}
              </Text>

              <Text style={styles.statLabel}>
                Plants
              </Text>
            </View>

            <View style={styles.statCard}>
              <MaterialCommunityIcons
                name="heart-pulse"
                size={26}
                color="#43A047"
              />

              <Text style={styles.statNumber}>
                {averageHealth}%
              </Text>

              <Text style={styles.statLabel}>
                Avg Health
              </Text>
            </View>

            <View style={styles.statCard}>
              <MaterialCommunityIcons
                name="trophy"
                size={26}
                color="#FFB300"
              />

              <Text style={styles.statNumber}>
                {achievements.filter((a) => a.unlocked).length}
              </Text>

              <Text style={styles.statLabel}>
                Badges
              </Text>
            </View>
          </View>

          {/* Achievements */}

          <Text style={styles.sectionTitle}>
            Achievements
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.badgeRow}
          >
            {achievements.map((badge) => (
              <View
                key={badge.label}
                style={[
                  styles.badge,
                  !badge.unlocked && styles.badgeLocked,
                ]}
              >
                <View
                  style={[
                    styles.badgeIconCircle,
                    {
                      backgroundColor: badge.unlocked
                        ? "#E8F5E9"
                        : "#EEEEEE",
                    },
                  ]}
                >
                  <MaterialCommunityIcons
                    name={badge.unlocked ? badge.icon : "lock"}
                    size={22}
                    color={badge.unlocked ? "#2E7D32" : "#AAAAAA"}
                  />
                </View>

                <Text
                  style={[
                    styles.badgeLabel,
                    !badge.unlocked && { color: "#AAAAAA" },
                  ]}
                >
                  {badge.label}
                </Text>
              </View>
            ))}
          </ScrollView>

          {/* Menu */}

          <Text style={styles.sectionTitle}>
            Menu
          </Text>

          <View style={styles.menuCard}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={item.label}
                style={[
                  styles.menuRow,
                  index === menuItems.length - 1 && {
                    borderBottomWidth: 0,
                  },
                ]}
                onPress={() => navigation.navigate(item.route)}
              >
                <View
                  style={[
                    styles.menuIconCircle,
                    { backgroundColor: `${item.color}22` },
                  ]}
                >
                  <MaterialCommunityIcons
                    name={item.icon}
                    size={20}
                    color={item.color}
                  />
                </View>

                <Text style={styles.menuLabel}>
                  {item.label}
                </Text>

                {item.route === "Cart" && cartItems.length > 0 && (
                  <View style={styles.cartBadge}>
                    <Text style={styles.cartBadgeText}>
                      {cartItems.length}
                    </Text>
                  </View>
                )}

                <MaterialCommunityIcons
                  name="chevron-right"
                  size={22}
                  color="#BBB"
                />
              </TouchableOpacity>
            ))}
          </View>

          {/* Log Out */}

          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <MaterialCommunityIcons
              name="logout"
              size={20}
              color="#E53935"
            />

            <Text style={styles.logoutText}>
              Log Out
            </Text>
          </TouchableOpacity>
        </ScrollView>
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
    marginBottom: 20,
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2E7D32",
  },

  avatarCard: {
    alignItems: "center",
    marginBottom: 22,
  },

  avatarWrap: {
    position: "relative",
  },

  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },

  editBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#2E7D32",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFF8EC",
  },

  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2E7D32",
    marginTop: 14,
  },

  subtitle: {
    marginTop: 4,
    color: "#777",
  },

  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 26,
  },

  statCard: {
    backgroundColor: "white",
    width: "31%",
    borderRadius: 18,
    alignItems: "center",
    paddingVertical: 16,
    elevation: 3,
  },

  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 8,
    color: "#2E7D32",
  },

  statLabel: {
    color: "#888",
    marginTop: 3,
    fontSize: 12,
    textAlign: "center",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 14,
  },

  badgeRow: {
    paddingBottom: 8,
    marginBottom: 22,
  },

  badge: {
    alignItems: "center",
    width: 78,
    marginRight: 14,
  },

  badgeLocked: {
    opacity: 0.6,
  },

  badgeIconCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    justifyContent: "center",
    alignItems: "center",
  },

  badgeLabel: {
    marginTop: 8,
    fontSize: 11,
    fontWeight: "600",
    color: "#555",
    textAlign: "center",
  },

  menuCard: {
    backgroundColor: "white",
    borderRadius: 20,
    paddingHorizontal: 16,
    marginBottom: 26,
    elevation: 3,
  },

  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F2",
  },

  menuIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
  },

  menuLabel: {
    flex: 1,
    marginLeft: 14,
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },

  cartBadge: {
    backgroundColor: "#E53935",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    paddingHorizontal: 5,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },

  cartBadgeText: {
    color: "white",
    fontSize: 11,
    fontWeight: "bold",
  },

  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 18,
    paddingVertical: 16,
    elevation: 2,
  },

  logoutText: {
    marginLeft: 10,
    color: "#E53935",
    fontSize: 16,
    fontWeight: "bold",
  },
});