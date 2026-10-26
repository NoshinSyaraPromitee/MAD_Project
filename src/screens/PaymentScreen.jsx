import React, { useContext, useState } from "react";
import { Alert, Modal, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import AppScreen from "../components/AppScreen";
import AppCard from "../components/AppCard";
import AppButton from "../components/AppButton";
import SectionTitle from "../components/SectionTitle";
import { CartContext } from "../context/CartContext";
import { palette, tealA } from "../theme/colors";
import { fredoka, inter } from "../theme/typography";
import { shadow } from "../theme/theme";
import { taka } from "../utils/format";
import { themed } from "../theme/themed";

const paymentMethods = [
  { id: "1", title: "Credit / Debit Card", icon: "credit-card-outline", value: "Card" },
  { id: "2", title: "bKash", icon: "cellphone", value: "bKash" },
  { id: "3", title: "Nagad", icon: "wallet-outline", value: "Nagad" },
  { id: "4", title: "Cash on Delivery", icon: "cash", value: "COD" },
];

export default function PaymentScreen({ route, navigation }) {
  const { total } = route.params;
  const { clearCart } = useContext(CartContext);

  const [selectedPayment, setSelectedPayment] = useState("Card");
  const [processing, setProcessing] = useState(false);
  const [resultModal, setResultModal] = useState(null); // null | "success" | "failed"

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
          "\u2705 Payment Successful",
          `\n\nYour payment of ${taka(total)} via ${selectedPayment} was successful. Your order has been placed!`,
          [{ text: "OK" }]
        );
      } else {
        setResultModal("failed");
        Alert.alert(
          "\u274C Payment Failed",
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

  const ok = resultModal === "success";

  return (
    <AppScreen title="Payment" scroll>
      <AppCard style={styles.secure}>
        <View style={styles.row}>
          <View style={styles.secureIcon}>
            <MaterialCommunityIcons name="shield-check" color={palette.accent} size={30} />
          </View>
          <View style={styles.flex}>
            <Text style={inter(17, "800", palette.accent)}>Secure Checkout</Text>
            <Text style={[inter(13, "500", palette.textMuted), styles.mt4]}>
              Your payment information is encrypted and secure.
            </Text>
          </View>
        </View>
      </AppCard>

      <SectionTitle title="Select Payment Method" />

      {paymentMethods.map((method) => {
        const selected = selectedPayment === method.value;
        return (
          <AppCard
            key={method.id}
            onPress={() => setSelectedPayment(method.value)}
            style={[styles.method, selected && styles.methodOn]}
            color={selected ? palette.greenCardFill : undefined}
            padding={14}
          >
            <View style={styles.row}>
              <View style={styles.methodIcon}>
                <MaterialCommunityIcons
                  name={method.icon}
                  size={24}
                  color={selected ? palette.accent : palette.textMuted}
                />
              </View>
              <Text style={[inter(16, "700", palette.textDark), styles.flex]}>{method.title}</Text>
              <MaterialCommunityIcons
                name={selected ? "check-circle" : "checkbox-blank-circle-outline"}
                size={24}
                color={palette.accent}
              />
            </View>
          </AppCard>
        );
      })}

      <AppCard style={styles.totalCard}>
        <Text style={inter(15, "600", palette.textMuted)}>Order Total</Text>
        <Text style={[fredoka(38, "700", palette.price), styles.mt4]}>{taka(total)}</Text>
      </AppCard>

      <AppButton
        label={processing ? "Processing..." : `Pay ${taka(total)}`}
        leftIcon={processing ? undefined : "lock"}
        loading={processing}
        onPress={handlePayment}
        style={styles.pay}
      />

      <Modal
        visible={resultModal !== null}
        transparent
        animationType="fade"
        onRequestClose={() => {
          if (resultModal === "failed") setResultModal(null);
        }}
      >
        <View style={styles.overlay}>
          <View style={styles.modalCard}>
            <View
              style={[
                styles.modalIcon,
                { backgroundColor: ok ? palette.greenCardFill : palette.failBg },
              ]}
            >
              <MaterialCommunityIcons
                name={ok ? "check-circle" : "close-circle"}
                size={56}
                color={ok ? palette.accent : palette.danger}
              />
            </View>

            <Text style={[fredoka(24, "700", palette.ink), styles.centerText]}>
              {ok ? "Payment Successful!" : "Payment Failed"}
            </Text>

            <Text style={[inter(14, "500", palette.textMuted, { lineHeight: 21 }), styles.modalMsg]}>
              {ok
                ? `Your payment of ${taka(total)} via ${selectedPayment} was completed successfully. Your order has been placed.`
                : "We could not process your payment. Please try again or choose a different payment method."}
            </Text>

            <AppButton
              label={ok ? "View Order" : "Try Again"}
              onPress={ok ? onSuccessContinue : () => setResultModal(null)}
              style={styles.modalBtn}
            />

            {!ok ? (
              <AppButton
                label="Change Payment Method"
                variant="outline"
                onPress={() => {
                  setResultModal(null);
                  navigation.goBack();
                }}
                style={styles.modalBtn2}
              />
            ) : null}
          </View>
        </View>
      </Modal>
    </AppScreen>
  );
}

const styles = themed(() => ({
  flex: { flex: 1 },
  row: { flexDirection: "row", alignItems: "center" },
  mt4: { marginTop: 4 },
  secure: { marginTop: 10 },
  secureIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: tealA(0.1),
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  method: { marginBottom: 12, borderWidth: 2, borderColor: "transparent" },
  methodOn: { borderColor: palette.accent },
  methodIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: tealA(0.08),
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  totalCard: { alignItems: "center", marginTop: 10 },
  pay: { marginTop: 24 },
  overlay: {
    flex: 1,
    backgroundColor: palette.overlay,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  modalCard: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: palette.surface,
    borderRadius: 28,
    padding: 26,
    alignItems: "center",
    ...shadow(12),
  },
  modalIcon: {
    width: 92,
    height: 92,
    borderRadius: 46,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  centerText: { textAlign: "center" },
  modalMsg: { textAlign: "center", marginTop: 10 },
  modalBtn: { marginTop: 22, alignSelf: "stretch" },
  modalBtn2: { marginTop: 10, alignSelf: "stretch" },
}));