import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { CartContext } from "../context/CartContext";

export default function CheckoutScreen({ navigation }) {
  const { totalPrice } = useContext(CartContext);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [delivery, setDelivery] = useState("Standard");

  const shipping =
    delivery === "Express" ? 12.99 : 5.99;

  const tax = totalPrice * 0.05;

  const total = totalPrice + shipping + tax;

  return (
    <LinearGradient
      colors={["#FFF7E7", "#E8FFD8", "#FFF8EC"]}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}

          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
            >
              <MaterialCommunityIcons
                name="arrow-left"
                size={28}
                color="#2E7D32"
              />
            </TouchableOpacity>

            <Text style={styles.title}>
              Checkout
            </Text>

            <View style={{ width: 28 }} />
          </View>

          {/* Shipping Information */}

          <Text style={styles.sectionTitle}>
            Shipping Information
          </Text>

          <TextInput
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />

          <TextInput
            placeholder="Phone Number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            style={styles.input}
          />

          <TextInput
            placeholder="Shipping Address"
            value={address}
            onChangeText={setAddress}
            multiline
            style={[styles.input, { height: 100 }]}
          />

          {/* Delivery */}

          <Text style={styles.sectionTitle}>
            Delivery Method
          </Text>

          <TouchableOpacity
            style={[
              styles.deliveryCard,
              delivery === "Standard" &&
                styles.selected,
            ]}
            onPress={() =>
              setDelivery("Standard")
            }
          >
            <Text style={styles.deliveryTitle}>
              Standard Delivery
            </Text>

            <Text>3-5 Days • $5.99</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.deliveryCard,
              delivery === "Express" &&
                styles.selected,
            ]}
            onPress={() =>
              setDelivery("Express")
            }
          >
            <Text style={styles.deliveryTitle}>
              Express Delivery
            </Text>

            <Text>1-2 Days • $12.99</Text>
          </TouchableOpacity>

          {/* Summary */}

          <Text style={styles.sectionTitle}>
            Order Summary
          </Text>

          <View style={styles.summary}>
            <View style={styles.row}>
              <Text>Subtotal</Text>
              <Text>${totalPrice.toFixed(2)}</Text>
            </View>

            <View style={styles.row}>
              <Text>Shipping</Text>
              <Text>${shipping.toFixed(2)}</Text>
            </View>

            <View style={styles.row}>
              <Text>Tax</Text>
              <Text>${tax.toFixed(2)}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.row}>
              <Text style={styles.total}>
                Total
              </Text>

              <Text style={styles.total}>
                ${total.toFixed(2)}
              </Text>
            </View>
          </View>

          {/* Continue */}

          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              navigation.navigate("Payment", {
                customer: {
                  name,
                  phone,
                  address,
                },
                delivery,
                total,
              })
            }
          >
            <Text style={styles.buttonText}>
              Continue to Payment
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#2E7D32",
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    marginTop: 10,
    color: "#2E7D32",
  },

  input: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },

  deliveryCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: "transparent",
  },

  selected: {
    borderColor: "#2E7D32",
  },

  deliveryTitle: {
    fontWeight: "bold",
    fontSize: 17,
    marginBottom: 5,
  },

  summary: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginTop: 10,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  divider: {
    borderBottomWidth: 1,
    borderColor: "#ddd",
    marginVertical: 10,
  },

  total: {
    fontWeight: "bold",
    fontSize: 20,
  },

  button: {
    backgroundColor: "#2E7D32",
    marginTop: 30,
    padding: 18,
    borderRadius: 20,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
});