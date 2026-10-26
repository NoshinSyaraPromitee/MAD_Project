import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import BottomTabNavigator from "./BottomTabNavigator";
import { palette } from "../theme/colors";

// Startup + Authentication
import SplashScreen from "../screens/SplashScreen";
import LandingScreen from "../screens/LandingScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";

// My Plants
import MyPlantsScreen from "../screens/MyPlantsScreen";
import PlantDetailsScreen from "../screens/PlantDetailsScreen";
import AddPlantScreen from "../screens/AddPlantScreen";
import CareCalendarScreen from "../screens/CareCalendarScreen";
import PlantHistoryScreen from "../screens/PlantHistoryScreen";

// Shop
import ProductDetailsScreen from "../screens/ProductDetailsScreen";
import CartScreen from "../screens/CartScreen";
import WishlistScreen from "../screens/WishlistScreen";
import CheckoutScreen from "../screens/CheckoutScreen";
import PaymentScreen from "../screens/PaymentScreen";
import OrderSuccessScreen from "../screens/OrderSuccessScreen";

// Other
import ScanResultScreen from "../screens/ScanResultScreen";
import CareGuideScreen from "../screens/CareGuideScreen";
import FertilizerScreen from "../screens/FertilizerScreen";
import FertilizerDetailsScreen from "../screens/FertilizerDetailsScreen";
import SettingsScreen from "../screens/SettingsScreen";

const Stack = createNativeStackNavigator();

export default function StackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
        contentStyle: { backgroundColor: palette.teal },
      }}
    >
      {/* Startup + Authentication */}
      <Stack.Screen name="Splash" component={SplashScreen} options={{ animation: "fade" }} />
      <Stack.Screen name="Landing" component={LandingScreen} options={{ animation: "fade" }} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />

      {/* Main App */}
      <Stack.Screen name="MainTabs" component={BottomTabNavigator} options={{ animation: "fade" }} />
      <Stack.Screen name="MyPlants" component={MyPlantsScreen} />
      <Stack.Screen name="PlantDetails" component={PlantDetailsScreen} />
      <Stack.Screen name="AddPlant" component={AddPlantScreen} />
      <Stack.Screen name="CareCalendar" component={CareCalendarScreen} />
      <Stack.Screen name="PlantHistory" component={PlantHistoryScreen} />

      {/* Secondary Screens */}
      <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="Wishlist" component={WishlistScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
      <Stack.Screen name="OrderSuccess" component={OrderSuccessScreen} options={{ animation: "fade" }} />
      <Stack.Screen name="ScanResult" component={ScanResultScreen} />
      <Stack.Screen name="CareGuide" component={CareGuideScreen} />
      <Stack.Screen name="FertilizerRecipes" component={FertilizerScreen} />
      <Stack.Screen name="FertilizerDetails" component={FertilizerDetailsScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
}