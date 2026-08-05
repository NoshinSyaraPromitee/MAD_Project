import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import myPlants from "../data/myPlants";
import { CartContext } from "../context/CartContext";

const { width } = Dimensions.get("window");

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

  const unlockedBadges = achievements.filter((a) => a.unlocked).length;

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
        {/* Top bar with Back + Settings */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={24}
              color="#2E7D32"
            />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Profile</Text>

          <TouchableOpacity
            style={styles.settingsBtn}
            onPress={() => navigation.navigate("Settings")}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name="cog-outline"
              size={24}
              color="#2E7D32"
            />
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Hero Profile Card */}
          <View style={styles.heroCard}>
            <LinearGradient
              colors={["#E8F5E9", "#C8E6C9"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.heroGradient}
            >
              <View style={styles.avatarRow}>
                <View style={styles.avatarWrap}>
                  <View style={styles.avatar}>
                    <MaterialCommunityIcons
                      name="sprout"
                      size={42}
                      color="white"
                    />
                  </View>
                  <TouchableOpacity style={styles.editBadge}>
                    <MaterialCommunityIcons
                      name="pencil"
                      size={13}
                      color="white"
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.userInfo}>
                  <Text style={styles.name}>Noshin</Text>
                  <Text style={styles.subtitle}>Plant Parent since 2026</Text>
                </View>
              </View>

              {/* Stats row inside hero */}
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{myPlants.length}</Text>
                  <Text style={styles.statLabel}>Plants</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{averageHealth}%</Text>
                  <Text style={styles.statLabel}>Avg Health</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{unlockedBadges}</Text>
                  <Text style={styles.statLabel}>Badges</Text>
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* Achievements */}
          <Text style={styles.sectionTitle}>Achievements</Text>
          <View style={styles.achievementsGrid}>
            {achievements.map((badge) => (
              <View
                key={badge.label}
                style={[
                  styles.badgeCard,
                  !badge.unlocked && styles.badgeLocked,
                ]}
              >
                <View
                  style={[
                    styles.badgeIconCircle,
                    {
                      backgroundColor: badge.unlocked
                        ? "#E8F5E9"
                        : "#F0F0F0",
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
                  numberOfLines={2}
                >
                  {badge.label}
                </Text>
              </View>
            ))}
          </View>

          {/* Quick Menu – 2-column grid */}
          <Text style={styles.sectionTitle}>Quick Menu</Text>
          <View style={styles.menuGrid}>
            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.label}
                style={styles.menuCard}
                onPress={() => navigation.navigate(item.route)}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.menuIconCircle,
                    { backgroundColor: `${item.color}18` },
                  ]}
                >
                  <MaterialCommunityIcons
                    name={item.icon}
                    size={22}
                    color={item.color}
                  />
                </View>
                <Text style={styles.menuLabel} numberOfLines={1}>
                  {item.label}
                </Text>

                {item.route === "Cart" && cartItems.length > 0 && (
                  <View style={styles.cartBadge}>
                    <Text style={styles.cartBadgeText}>
                      {cartItems.length}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Log Out */}
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons
              name="logout"
              size={20}
              color="#E53935"
            />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },

  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },

  settingsBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2E7D32",
  },

  scrollContent: {
    paddingHorizontal: 18,
    paddingBottom: 40,
  },

  // Hero
  heroCard: {
    borderRadius: 24,
    overflow: "hidden",
    marginBottom: 24,
    elevation: 4,
    shadowColor: "#2E7D32",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
  },

  heroGradient: {
    padding: 20,
  },

  avatarRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },

  avatarWrap: {
    position: "relative",
  },

  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
  },

  editBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#2E7D32",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E8F5E9",
  },

  userInfo: {
    marginLeft: 16,
    flex: 1,
  },

  name: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1B5E20",
  },

  subtitle: {
    marginTop: 3,
    fontSize: 13,
    color: "#558B2F",
  },

  statsRow: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.65)",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 8,
  },

  statItem: {
    flex: 1,
    alignItems: "center",
  },

  statDivider: {
    width: 1,
    backgroundColor: "rgba(46,125,50,0.15)",
    marginVertical: 4,
  },

  statNumber: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2E7D32",
  },

  statLabel: {
    fontSize: 11,
    color: "#666",
    marginTop: 2,
  },

  // Sections
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#333",
    marginBottom: 12,
  },

  // Achievements grid
  achievementsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 24,
  },

  badgeCard: {
    width: (width - 36 - 24) / 3,
    backgroundColor: "white",
    borderRadius: 16,
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 6,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },

  badgeLocked: {
    opacity: 0.55,
  },

  badgeIconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },

  badgeLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#555",
    textAlign: "center",
  },

  // Menu grid
  menuGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 28,
  },

  menuCard: {
    width: (width - 36 - 14) / 2,
    backgroundColor: "white",
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 14,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },

  menuIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  menuLabel: {
    flex: 1,
    marginLeft: 12,
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
  },

  cartBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#E53935",
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    justifyContent: "center",
    alignItems: "center",
  },

  cartBadgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },

  // Logout
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 18,
    paddingVertical: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },

  logoutText: {
    marginLeft: 10,
    color: "#E53935",
    fontSize: 16,
    fontWeight: "700",
  },
});