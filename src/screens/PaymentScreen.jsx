import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { CartContext } from "../context/CartContext";

export default function PaymentScreen({ route, navigation }) {
  const { total } = route.params;

  const { clearCart } = useContext(CartContext);

  const [selectedPayment, setSelectedPayment] = useState("Card");

  const paymentMethods = [
    {
      id: "1",
      title: "Credit / Debit Card",
      icon: "credit-card-outline",
      value: "Card",
    },
    {
      id: "2",
      title: "bKash",
      icon: "cellphone",
      value: "bKash",
    },
    {
      id: "3",
      title: "Nagad",
      icon: "wallet-outline",
      value: "Nagad",
    },
    {
      id: "4",
      title: "Cash on Delivery",
      icon: "cash",
      value: "COD",
    },
  ];

  const handlePayment = () => {
    Alert.alert(
      "Payment Successful",
      "Your order has been placed successfully!",
      [
        {
          text: "OK",
          onPress: () => {
            clearCart();

            navigation.replace("OrderSuccess");
          },
        },
      ]
    );
  };

  return (
    <LinearGradient
      colors={["#FFF7E7", "#E8FFD8", "#FFF8EC"]}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.container}
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
              Payment
            </Text>

            <View style={{ width: 28 }} />
          </View>

          {/* Secure Banner */}

          <View style={styles.secureCard}>
            <MaterialCommunityIcons
              name="shield-check"
              color="#2E7D32"
              size={40}
            />

            <View style={{ marginLeft: 15 }}>
              <Text style={styles.secureTitle}>
                Secure Checkout
              </Text>

              <Text style={styles.secureText}>
                All payments are encrypted.
              </Text>
            </View>
          </View>

          {/* Payment Methods */}

          <Text style={styles.sectionTitle}>
            Choose Payment Method
          </Text>

          {paymentMethods.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.paymentCard,
                selectedPayment === item.value &&
                  styles.selected,
              ]}
              onPress={() =>
                setSelectedPayment(item.value)
              }
            >
              <MaterialCommunityIcons
                name={item.icon}
                size={28}
                color="#2E7D32"
              />

              <Text style={styles.paymentText}>
                {item.title}
              </Text>

              {selectedPayment === item.value && (
                <MaterialCommunityIcons
                  name="check-circle"
                  color="#2E7D32"
                  size={24}
                />
              )}
            </TouchableOpacity>
          ))}

          {/* Order Summary */}

          <View style={styles.summary}>
            <Text style={styles.summaryTitle}>
              Order Total
            </Text>

            <Text style={styles.total}>
              ${total.toFixed(2)}
            </Text>
          </View>

          {/* Pay Button */}

          <TouchableOpacity
            style={styles.payButton}
            onPress={handlePayment}
          >
            <MaterialCommunityIcons
              name="lock"
              size={20}
              color="white"
            />

            <Text style={styles.payText}>
              Pay ${total.toFixed(2)}
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
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2E7D32",
  },

  secureCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    marginBottom: 25,
  },

  secureTitle: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#2E7D32",
  },

  secureText: {
    color: "#777",
    marginTop: 5,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 15,
  },

  paymentCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 18,
    borderRadius: 18,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: "transparent",
  },

  selected: {
    borderColor: "#2E7D32",
  },

  paymentText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 17,
    fontWeight: "600",
  },

  summary: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 25,
    marginTop: 10,
    alignItems: "center",
  },

  summaryTitle: {
    color: "#666",
    fontSize: 18,
  },

  total: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#FF9800",
    marginTop: 10,
  },

  payButton: {
    marginTop: 30,
    backgroundColor: "#2E7D32",
    padding: 18,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },

  payText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
});