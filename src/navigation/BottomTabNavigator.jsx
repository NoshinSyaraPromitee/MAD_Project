import React from "react";
import { View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import HomeScreen from "../screens/HomeScreen";
import ScanPlantScreen from "../screens/ScanPlantScreen";
import ShopScreen from "../screens/ShopScreen";
import AIChatScreen from "../screens/AIChatScreen";
import ProfileScreen from "../screens/ProfileScreen";

import { palette, creamA } from "../theme/colors";
import { themed } from "../theme/themed";

const Tab = createBottomTabNavigator();

const ICONS = {
  Home: ["home-outline", "home"],
  Scan: ["camera-outline", "camera"],
  Shop: ["shopping-outline", "shopping"],
  "AI Doctor": ["robot-outline", "robot"],
  Profile: ["account-outline", "account"],
};

// Deep teal bar, cream icons; the selected tab gets a cream pill with a teal icon.
function TabIcon({ routeName, focused }) {
  const [outline, filled] = ICONS[routeName] || ["circle-outline", "circle"];
  return (
    <View style={[styles.pill, focused && styles.pillOn]}>
      <MaterialCommunityIcons
        name={focused ? filled : outline}
        size={24}
        color={focused ? palette.teal : creamA(0.85)}
      />
    </View>
  );
}

export default function BottomTabNavigator() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      initialRouteName="Home"
      backBehavior="history"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarShowLabel: true,
        tabBarActiveTintColor: palette.cream,
        tabBarInactiveTintColor: creamA(0.85),
        tabBarLabelStyle: styles.label,
        tabBarStyle: [
          styles.bar,
          { height: 66 + insets.bottom, paddingBottom: 8 + insets.bottom },
        ],
        tabBarIcon: ({ focused }) => <TabIcon routeName={route.name} focused={focused} />,
        sceneStyle: { backgroundColor: palette.teal },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Scan" component={ScanPlantScreen} />
      <Tab.Screen name="Shop" component={ShopScreen} />
      <Tab.Screen name="AI Doctor" component={AIChatScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = themed(() => ({
  bar: {
    backgroundColor: palette.tabBar,
    borderTopWidth: 1.5,
    borderTopColor: creamA(0.35),
    paddingTop: 8,
    elevation: 0,
  },
  label: {
    fontFamily: "Inter_700Bold",
    fontSize: 11,
    marginTop: 2,
  },
  pill: {
    width: 56,
    height: 30,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  pillOn: { backgroundColor: palette.cream },
}));