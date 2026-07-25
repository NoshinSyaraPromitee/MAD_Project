import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";

// Screens
import HomeScreen from "../screens/HomeScreen";
import ScanPlantScreen from "../screens/ScanPlantScreen";
import ShopScreen from "../screens/ShopScreen";
import AIChatScreen from "../screens/AIChatScreen";
import ProfileScreen from "../screens/ProfileScreen";

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarShowLabel: true,

        tabBarActiveTintColor: "#2E7D32",

        tabBarInactiveTintColor: "#999",

        tabBarStyle: {
          height: 70,
          paddingBottom: 8,
          paddingTop: 8,
          backgroundColor: "#FFFFFF",
          borderTopWidth: 0,
          elevation: 15,
        },

        tabBarIcon: ({ color, size }) => {
          let iconName;

          switch (route.name) {
            case "Home":
              iconName = "home";
              break;

            case "Scan":
              iconName = "camera";
              break;

            case "Shop":
              iconName = "shopping";
              break;

            case "AI Doctor":
              iconName = "robot";
              break;

            case "Profile":
              iconName = "account";
              break;

            default:
              iconName = "circle";
          }

          return (
            <MaterialCommunityIcons
              name={iconName}
              size={size}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
      />

      <Tab.Screen
        name="Scan"
        component={ScanPlantScreen}
      />

      <Tab.Screen
        name="Shop"
        component={ShopScreen}
      />

      <Tab.Screen
        name="AI Doctor"
        component={AIChatScreen}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
      />
    </Tab.Navigator>
  );
}