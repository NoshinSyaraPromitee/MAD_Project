import React, { useContext, useState } from "react";
import { Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import AppScreen from "../components/AppScreen";
import AppCard from "../components/AppCard";
import AppTextField from "../components/AppTextField";
import AppButton from "../components/AppButton";
import SectionTitle from "../components/SectionTitle";
import { CartContext } from "../context/CartContext";
import { palette, tealA } from "../theme/colors";
import { inter } from "../theme/typography";
import { BULLET, taka } from "../utils/format";
import { themed } from "../theme/themed";

const DELIVERY = {
  Standard: { title: "Standard Delivery", eta: "3-5 Days", fee: 5.99, icon: "truck-outline" },
  Express: { title: "Express Delivery", eta: "1-2 Days", fee: 12.99, icon: "truck-fast-outline" },
};

export default function CheckoutScreen({ navigation }) {
  const { totalPrice } = useContext(CartContext);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [delivery, setDelivery] = useState("Standard");

  const shipping = DELIVERY[delivery].fee;
  const tax = totalPrice * 0.05;
  const total = totalPrice + shipping + tax;

  const line = (label, value, bold) => (
    <View style={styles.sumRow}>
      <Text style={inter(bold ? 18 : 14, bold ? "800" : "500", palette.textDark)}>{label}</Text>
      <Text style={inter(bold ? 18 : 14, bold ? "800" : "600", palette.textDark)}>{taka(value)}</Text>
    </View>
  );

  return (
    <AppScreen title="Checkout" scroll>
      <SectionTitle title="Shipping Information" />
      <AppTextField icon="account-outline" placeholder="Full Name" value={name} onChangeText={setName} />
      <AppTextField
        icon="phone-outline"
        placeholder="Phone Number"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      <AppTextField
        icon="map-marker-outline"
        placeholder="Shipping Address"
        value={address}
        onChangeText={setAddress}
        multiline
      />

      <SectionTitle title="Delivery Method" />
      {Object.entries(DELIVERY).map(([key, d]) => {
        const selected = delivery === key;
        return (
          <AppCard
            key={key}
            onPress={() => setDelivery(key)}
            style={[styles.option, selected && styles.optionOn]}
            color={selected ? palette.greenCardFill : undefined}
          >
            <View style={styles.row}>
              <View style={styles.optIcon}>
                <MaterialCommunityIcons name={d.icon} size={22} color={palette.accent} />
              </View>
              <View style={styles.flex}>
                <Text style={inter(16, "700", palette.textDark)}>{d.title}</Text>
                <Text style={inter(13, "500", palette.textMuted)}>
                  {d.eta} {BULLET} {taka(d.fee)}
                </Text>
              </View>
              <MaterialCommunityIcons
                name={selected ? "radiobox-marked" : "radiobox-blank"}
                size={24}
                color={palette.accent}
              />
            </View>
          </AppCard>
        );
      })}

      <SectionTitle title="Order Summary" />
      <AppCard>
        {line("Subtotal", totalPrice)}
        {line("Shipping", shipping)}
        {line("Tax (5%)", tax)}
        <View style={styles.divider} />
        {line("Total", total, true)}
      </AppCard>

      <AppButton
        label="Continue to Payment"
        rightIcon="arrow-right"
        style={styles.button}
        onPress={() =>
          navigation.navigate("Payment", {
            customer: { name, phone, address },
            delivery,
            total,
          })
        }
      />
    </AppScreen>
  );
}

const styles = themed(() => ({
  flex: { flex: 1 },
  row: { flexDirection: "row", alignItems: "center" },
  option: { marginBottom: 12, borderWidth: 2, borderColor: "transparent" },
  optionOn: { borderColor: palette.accent },
  optIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: tealA(0.1),
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  sumRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  divider: { height: 1, backgroundColor: tealA(0.15), marginVertical: 6 },
  button: { marginTop: 24 },
}));