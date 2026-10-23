import React, { useContext } from "react";
import { FlatList, Image, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import AppScreen from "../components/AppScreen";
import AppCard from "../components/AppCard";
import AppButton from "../components/AppButton";
import EmptyView from "../components/EmptyView";
import QuantityStepper from "../components/QuantityStepper";
import { CartContext } from "../context/CartContext";
import { palette, tealA } from "../theme/colors";
import { inter } from "../theme/typography";
import { shadow } from "../theme/theme";
import { taka } from "../utils/format";
import { themed } from "../theme/themed";

export default function CartScreen({ navigation }) {
  const { cartItems, increaseQuantity, decreaseQuantity, removeFromCart, totalPrice } =
    useContext(CartContext);

  const shipping = cartItems.length > 0 ? 5.99 : 0;
  const tax = totalPrice * 0.05;
  const grandTotal = totalPrice + shipping + tax;

  const goToShop = () => navigation.navigate("MainTabs", { screen: "Shop" });

  const renderItem = ({ item }) => (
    <AppCard style={styles.card} padding={12}>
      <View style={styles.row}>
        <Image source={{ uri: item.image }} style={styles.image} />

        <View style={styles.info}>
          <Text style={inter(15, "700", palette.textDark)} numberOfLines={2}>
            {item.name}
          </Text>
          <View style={styles.metaRow}>
            <Text style={inter(12, "500", palette.textMuted)}>{item.category}</Text>
            {item.unit ? (
              <View style={styles.unitPill}>
                <Text style={inter(10, "700", palette.accent)}>{item.unit}</Text>
              </View>
            ) : null}
          </View>
          <Text style={inter(16, "800", palette.price)}>{taka(item.price)}</Text>
          <View style={styles.stepper}>
            <QuantityStepper
              value={item.quantity}
              onMinus={() => decreaseQuantity(item.id)}
              onPlus={() => increaseQuantity(item.id)}
            />
          </View>
        </View>

        <Pressable onPress={() => removeFromCart(item.id)} hitSlop={8} style={styles.remove}>
          <MaterialCommunityIcons name="delete-outline" size={22} color={palette.danger} />
        </Pressable>
      </View>
    </AppCard>
  );

  const line = (label, value, bold) => (
    <View style={styles.sumRow}>
      <Text style={inter(bold ? 18 : 14, bold ? "800" : "500", palette.textDark)}>{label}</Text>
      <Text style={inter(bold ? 18 : 14, bold ? "800" : "600", palette.textDark)}>{taka(value)}</Text>
    </View>
  );

  return (
    <AppScreen title="My Cart" padded={false} edges={["top", "left", "right"]}>
      {cartItems.length === 0 ? (
        <EmptyView
          icon="cart-outline"
          title="Your cart is empty"
          subtitle="Find something green for your garden."
          actionLabel="Continue Shopping"
          onAction={goToShop}
        />
      ) : (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />

          <SafeAreaView edges={["bottom"]} style={styles.summary}>
            {line("Subtotal", totalPrice)}
            {line("Shipping", shipping)}
            {line("Tax (5%)", tax)}
            <View style={styles.divider} />
            {line("Total", grandTotal, true)}
            <AppButton
              label="Proceed to Checkout"
              rightIcon="arrow-right"
              onPress={() => navigation.navigate("Checkout")}
              style={styles.checkout}
            />
          </SafeAreaView>
        </>
      )}
    </AppScreen>
  );
}

const styles = themed(() => ({
  list: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 16 },
  card: { marginBottom: 12 },
  row: { flexDirection: "row", alignItems: "flex-start" },
  image: { width: 88, height: 88, borderRadius: 14 },
  info: { flex: 1, marginLeft: 12 },
  metaRow: { flexDirection: "row", alignItems: "center", marginVertical: 4 },
  unitPill: {
    backgroundColor: palette.greenCardFill,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 1,
    marginLeft: 6,
  },
  stepper: { marginTop: 8 },
  remove: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: palette.dangerBg,
    alignItems: "center",
    justifyContent: "center",
  },
  summary: {
    backgroundColor: palette.surface,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderTopWidth: 1.5,
    borderColor: palette.edge,
    paddingHorizontal: 24,
    paddingTop: 22,
    paddingBottom: 12,
    ...shadow(16),
  },
  sumRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  divider: { height: 1, backgroundColor: tealA(0.15), marginVertical: 6 },
  checkout: { marginTop: 12 },
}));