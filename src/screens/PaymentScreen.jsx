import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { CartContext } from "../context/CartContext";

export default function PaymentScreen({ route, navigation }) {
  const { total } = route.params;

  const { clearCart } = useContext(CartContext);

  const [selectedPayment, setSelectedPayment] = useState("Card");
  const [processing, setProcessing] = useState(false);
  const [resultModal, setResultModal] = useState(null); // null | "success" | "failed"

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
    if (processing) return;

    setProcessing(true);

    // Simulate payment processing (1.5 seconds)
    setTimeout(() => {
      setProcessing(false);

      // Always succeed for demo (change to Math.random() > 0.2 for random fail)
      const success = true;
if (success) {
  setResultModal("success");
  Alert.alert(
    "✅ Payment Successful",
    `\n\nYour payment of ৳${total.toFixed(2)} via ${selectedPayment} was successful. Your order has been placed!`,
    [{ text: "OK" }]
  );
}else {
        setResultModal("failed");
        Alert.alert(
          "❌ Payment Failed",
          "Something went wrong while processing your payment. Please try again or choose another method.",
          [{ text: "OK" }]
        );
      }
    }, 1500);
  };

  const onSuccessContinue = () => {
    setResultModal(null);
    clearCart();
    navigation.replace("OrderSuccess");
  };

  const onFailedRetry = () => {
    setResultModal(null);
  };

  return (
    <LinearGradient
      colors={["#FFF7E7", "#E8FFD8", "#FFF8EC"]}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container}>
          {/* Header */}

          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <MaterialCommunityIcons
                name="arrow-left"
                size={28}
                color="#2E7D32"
              />
            </TouchableOpacity>

            <Text style={styles.title}>Payment</Text>

            <View style={{ width: 28 }} />
          </View>

          {/* Secure Banner */}

          <View style={styles.secureCard}>
            <MaterialCommunityIcons
              name="shield-check"
              color="#2E7D32"
              size={40}
            />

            <View style={{ marginLeft: 15, flex: 1 }}>
              <Text style={styles.secureTitle}>Secure Checkout</Text>
              <Text style={styles.secureText}>
                Your payment information is encrypted and secure.
              </Text>
            </View>
          </View>

          {/* Payment Methods */}

          <Text style={styles.sectionTitle}>Select Payment Method</Text>

          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.paymentCard,
                selectedPayment === method.value && styles.selected,
              ]}
              onPress={() => setSelectedPayment(method.value)}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons
                name={method.icon}
                size={28}
                color={
                  selectedPayment === method.value ? "#2E7D32" : "#666"
                }
              />

              <Text style={styles.paymentText}>{method.title}</Text>

              {selectedPayment === method.value && (
                <MaterialCommunityIcons
                  name="check-circle"
                  size={24}
                  color="#2E7D32"
                />
              )}
            </TouchableOpacity>
          ))}

          {/* Order Total */}

          <View style={styles.summary}>
            <Text style={styles.summaryTitle}>Order Total</Text>

            <Text style={styles.total}>৳{total.toFixed(2)}</Text>
          </View>

          {/* Pay Button */}

          <TouchableOpacity
            style={[styles.payButton, processing && styles.payButtonDisabled]}
            onPress={handlePayment}
            disabled={processing}
            activeOpacity={0.85}
          >
            {processing ? (
              <>
                <ActivityIndicator color="white" size="small" />
                <Text style={styles.payText}>Processing...</Text>
              </>
            ) : (
              <>
                <MaterialCommunityIcons name="lock" size={20} color="white" />
                <Text style={styles.payText}>
                  Pay ৳{total.toFixed(2)}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </ScrollView>

        {/* Result Modal */}

        <Modal
          visible={resultModal !== null}
          transparent
          animationType="fade"
          onRequestClose={() => {
            if (resultModal === "failed") setResultModal(null);
          }}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <View
                style={[
                  styles.modalIconCircle,
                  {
                    backgroundColor:
                      resultModal === "success" ? "#E8F5E9" : "#FFEBEE",
                  },
                ]}
              >
                <MaterialCommunityIcons
                  name={
                    resultModal === "success"
                      ? "check-circle"
                      : "close-circle"
                  }
                  size={56}
                  color={resultModal === "success" ? "#2E7D32" : "#E53935"}
                />
              </View>

              <Text style={styles.modalTitle}>
                {resultModal === "success"
                  ? "Payment Successful!"
                  : "Payment Failed"}
              </Text>

              <Text style={styles.modalMessage}>
                {resultModal === "success"
                  ? `Your payment of ৳${total.toFixed(
                      2
                    )} via ${selectedPayment} was completed successfully. Your order has been placed.`
                  : "We could not process your payment. Please try again or choose a different payment method."}
              </Text>

              {resultModal === "success" ? (
                <TouchableOpacity
                  style={styles.modalPrimaryBtn}
                  onPress={onSuccessContinue}
                >
                  <Text style={styles.modalPrimaryText}>View Order</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.modalPrimaryBtn}
                  onPress={onFailedRetry}
                >
                  <Text style={styles.modalPrimaryText}>Try Again</Text>
                </TouchableOpacity>
              )}

              {resultModal === "failed" && (
                <TouchableOpacity
                  style={styles.modalSecondaryBtn}
                  onPress={() => {
                    setResultModal(null);
                    navigation.goBack();
                  }}
                >
                  <Text style={styles.modalSecondaryText}>
                    Change Payment Method
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </Modal>
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

  payButtonDisabled: {
    backgroundColor: "#81C784",
  },

  payText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  modalCard: {
    backgroundColor: "white",
    borderRadius: 24,
    padding: 28,
    width: "100%",
    maxWidth: 360,
    alignItems: "center",
  },

  modalIconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#222",
    textAlign: "center",
  },

  modalMessage: {
    marginTop: 12,
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
  },

  modalPrimaryBtn: {
    marginTop: 24,
    backgroundColor: "#2E7D32",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 28,
    width: "100%",
    alignItems: "center",
  },

  modalPrimaryText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },

  modalSecondaryBtn: {
    marginTop: 12,
    paddingVertical: 12,
    width: "100%",
    alignItems: "center",
  },

  modalSecondaryText: {
    color: "#2E7D32",
    fontWeight: "600",
    fontSize: 15,
  },
});