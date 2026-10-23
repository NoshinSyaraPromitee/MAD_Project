import React, { useContext } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import AppScreen from "../components/AppScreen";
import AppCard from "../components/AppCard";
import AppButton from "../components/AppButton";
import SectionTitle from "../components/SectionTitle";
import myPlants from "../data/myPlants";
import { CartContext } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { palette } from "../theme/colors";
import { fredoka, inter } from "../theme/typography";
import { shadow } from "../theme/theme";
import { themed } from "../theme/themed";

const achievements = [
  { icon: "seed", label: "First Sprout", unlocked: true },
  { icon: "water", label: "Hydration Hero", unlocked: true },
  { icon: "leaf", label: "Green Thumb", unlocked: true },
  { icon: "camera", label: "Scan Master", unlocked: true },
  { icon: "trophy", label: "Plant Legend", unlocked: false },
];

const getMenuItems = () => [
  { icon: "flower", label: "My Plants", route: "MyPlants", color: "#43A047" },
  { icon: "calendar-check", label: "Care Calendar", route: "CareCalendar", color: "#2A9D8F" },
  { icon: "flask-outline", label: "Fertilizer Recipes", route: "FertilizerRecipes", color: "#B77900" },
  { icon: "history", label: "Plant History", route: "PlantHistory", color: "#7B4B7A" },
  { icon: "heart-outline", label: "Wishlist", route: "Wishlist", color: "#D14562" },
  { icon: "cart", label: "My Cart", route: "Cart", color: "#FB8C00" },
  { icon: "book-open-page-variant-outline", label: "Care Guide", route: "CareGuide", color: palette.accent },
  { icon: "cog", label: "Settings", route: "Settings", color: "#757575" },
];

export default function ProfileScreen({ navigation }) {
  const { cartItems } = useContext(CartContext);
  const { user, logout } = useAuth();

  const displayName = user?.name || (user?.email ? user.email.split("@")[0] : "Noshin");

  const averageHealth = myPlants.length
    ? Math.round(myPlants.reduce((sum, p) => sum + p.health, 0) / myPlants.length)
    : 0;

  const menuItems = getMenuItems();
  const unlockedBadges = achievements.filter((a) => a.unlocked).length;

  const handleLogout = () => {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log Out",
        style: "destructive",
        onPress: async () => {
          await logout();
          navigation.reset({ index: 0, routes: [{ name: "Landing" }] });
        },
      },
    ]);
  };

  const stat = (value, label) => (
    <View style={styles.stat}>
      <Text style={inter(24, "800", palette.accent)}>{value}</Text>
      <Text style={inter(12, "600", palette.textMuted)}>{label}</Text>
    </View>
  );

  return (
    <AppScreen
      title="Profile"
      showBack={false}
      edges={["top"]}
      scroll
      trailing={
        <Pressable
          style={({ pressed }) => [styles.gear, pressed && { opacity: 0.8 }]}
          onPress={() => navigation.navigate("Settings")}
        >
          <MaterialCommunityIcons name="cog-outline" size={24} color={palette.accent} />
        </Pressable>
      }
    >
      {/* Header card */}
      <LinearGradient
        colors={[palette.surface, palette.greenCardFill]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        <View style={styles.avatarRow}>
          <View>
            <View style={styles.avatar}>
              <MaterialCommunityIcons name="sprout" size={44} color={palette.cream} />
            </View>
            <Pressable style={styles.editBadge}>
              <MaterialCommunityIcons name="pencil" size={13} color={palette.cream} />
            </Pressable>
          </View>
          <View style={styles.userInfo}>
            <Text style={fredoka(26, "700", palette.textDark)} numberOfLines={2}>
              {displayName}
            </Text>
            <Text style={inter(14, "500", palette.textMuted)}>Plant Parent since 2026</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          {stat(myPlants.length, "Plants")}
          {stat(`${averageHealth}%`, "Avg Health")}
          {stat(unlockedBadges, "Badges")}
        </View>
      </LinearGradient>

      {/* Achievements */}
      <SectionTitle title="Achievements" />
      <View style={styles.badges}>
        {achievements.map((badge) => (
          <AppCard
            key={badge.label}
            padding={10}
            style={[styles.badge, !badge.unlocked && styles.locked]}
          >
            <View
              style={[
                styles.badgeIcon,
                { backgroundColor: badge.unlocked ? palette.greenCardFill : palette.lockedBg },
              ]}
            >
              <MaterialCommunityIcons
                name={badge.unlocked ? badge.icon : "lock"}
                size={22}
                color={badge.unlocked ? palette.accent : palette.lockedFg}
              />
            </View>
            <Text
              style={[
                inter(11, "700", badge.unlocked ? palette.textDark : palette.lockedFg),
                styles.centerText,
              ]}
              numberOfLines={2}
            >
              {badge.label}
            </Text>
          </AppCard>
        ))}
      </View>

      {/* Quick menu */}
      <SectionTitle title="Quick Menu" />
      <View style={styles.menuGrid}>
        {menuItems.map((item) => (
          <AppCard
            key={item.label}
            padding={12}
            style={styles.menuCard}
            onPress={() => navigation.navigate(item.route)}
          >
            <View style={styles.menuRow}>
              <View style={[styles.menuIcon, { backgroundColor: `${item.color}24` }]}>
                <MaterialCommunityIcons name={item.icon} size={18} color={item.color} />
              </View>
              <Text style={[inter(13, "700", palette.textDark), styles.flex]} numberOfLines={1}>
                {item.label}
              </Text>
            </View>
            {item.route === "Cart" && cartItems.length > 0 ? (
              <View style={styles.cartBadge}>
                <Text style={inter(10, "800", palette.white)}>{cartItems.length}</Text>
              </View>
            ) : null}
          </AppCard>
        ))}
      </View>

      <AppButton
        label="Log Out"
        leftIcon="logout"
        variant="danger"
        onPress={handleLogout}
        style={styles.logout}
      />
    </AppScreen>
  );
}

const styles = themed(() => ({
  flex: { flex: 1 },
  centerText: { textAlign: "center" },
  gear: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: palette.surface,
    borderWidth: 2,
    borderColor: palette.accent,
    alignItems: "center",
    justifyContent: "center",
    ...shadow(3),
  },
  hero: {
    marginTop: 10,
    borderRadius: 28,
    padding: 20,
    borderWidth: 1.5,
    borderColor: palette.edge,
    ...shadow(6, 0.25),
  },
  avatarRow: { flexDirection: "row", alignItems: "center" },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: palette.teal,
    alignItems: "center",
    justifyContent: "center",
  },
  editBadge: {
    position: "absolute",
    right: -2,
    bottom: -2,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: palette.buttonOrange,
    borderWidth: 2,
    borderColor: palette.cream,
    alignItems: "center",
    justifyContent: "center",
  },
  userInfo: { flex: 1, marginLeft: 16 },
  statsRow: {
    flexDirection: "row",
    marginTop: 18,
    paddingVertical: 12,
    borderRadius: 18,
    backgroundColor: palette.glass,
  },
  stat: { flex: 1, alignItems: "center" },
  badges: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  badge: { width: "31.5%", alignItems: "center", marginBottom: 10 },
  locked: { opacity: 0.6 },
  badgeIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  menuGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  menuCard: { width: "48.5%", marginBottom: 12 },
  menuRow: { flexDirection: "row", alignItems: "center" },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  cartBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 4,
    backgroundColor: palette.danger,
    alignItems: "center",
    justifyContent: "center",
  },
  logout: { marginTop: 12 },
}));