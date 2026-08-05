import React from "react";
import { NavigationContainer } from "@react-navigation/native";

import { PlantProvider } from "./src/context/PlantContext";
import { CartProvider } from "./src/context/CartContext";
import { WishlistProvider } from "./src/context/WishlistContext";

import StackNavigator from "./src/navigation/StackNavigator";
import MyPlantsScreen from "./src/screens/MyPlantsScreen";
import PlantDetailsScreen from "./src/screens/PlantDetailsScreen";
import AddPlantScreen from "./src/screens/AddPlantScreen";

export default function App() {
  return (
    <PlantProvider>
      <CartProvider>
        <WishlistProvider>
          <NavigationContainer>
            <StackNavigator />
          </NavigationContainer>
        </WishlistProvider>
      </CartProvider>
    </PlantProvider>
  );
}