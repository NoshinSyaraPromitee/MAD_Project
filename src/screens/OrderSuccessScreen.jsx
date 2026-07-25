import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function OrderSuccessScreen({ navigation }) {
  const orderId =
    "#" + Math.floor(Math.random() * 900000 + 100000);

  return (
    <LinearGradient
      colors={["#FFF7E7", "#E8FFD8", "#FFF8EC"]}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={styles.container}>

        <View style={styles.circle}>
          <MaterialCommunityIcons
            name="check-bold"
            size={90}
            color="white"
          />
        </View>

        <Text style={styles.title}>
          Order Confirmed!
        </Text>

        <Text style={styles.subtitle}>
          Thank you for shopping with MyPlantPal.
        </Text>

        <Text style={styles.subtitle}>
          Your order has been placed successfully.
        </Text>

        <View style={styles.card}>

          <View style={styles.row}>
            <Text style={styles.label}>
              Order ID
            </Text>

            <Text style={styles.value}>
              {orderId}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.label}>
              Estimated Delivery
            </Text>

            <Text style={styles.value}>
              3-5 Days
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.label}>
              Status
            </Text>

            <Text
              style={[
                styles.value,
                { color: "#2E7D32" },
              ]}
            >
              Processing
            </Text>
          </View>

        </View>

        <TouchableOpacity
          style={styles.homeButton}
          onPress={() =>
            navigation.reset({
              index: 0,
              routes: [{ name: "MainTabs" }],
            })
          }
        >
          <MaterialCommunityIcons
            name="MainTabs"
            size={22}
            color="white"
          />

          <Text style={styles.buttonText}>
            Back to Home
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.shopButton}
          onPress={() =>
            navigation.reset({
              index: 0,
              routes: [{ name: "MainTabs" }],
            })
          }
        >
          <MaterialCommunityIcons
            name="shopping"
            size={22}
            color="#2E7D32"
          />

          <Text style={styles.shopText}>
            Continue Shopping
          </Text>
        </TouchableOpacity>

      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 25,
  },

  circle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#2E7D32",
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
  },

  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 35,
    color: "#2E7D32",
  },

  subtitle: {
    color: "#666",
    fontSize: 16,
    textAlign: "center",
    marginTop: 8,
  },

  card: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 25,
    padding: 25,
    marginTop: 35,
    elevation: 5,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  divider: {
    height: 1,
    backgroundColor: "#E5E5E5",
    marginVertical: 18,
  },

  label: {
    color: "#666",
    fontSize: 16,
  },

  value: {
    fontWeight: "bold",
    fontSize: 16,
  },

  homeButton: {
    width: "100%",
    backgroundColor: "#2E7D32",
    borderRadius: 18,
    padding: 18,
    marginTop: 35,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },

  shopButton: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 18,
    padding: 18,
    marginTop: 15,
    borderWidth: 2,
    borderColor: "#2E7D32",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  shopText: {
    color: "#2E7D32",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
});