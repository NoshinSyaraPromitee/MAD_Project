import React, { useContext } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import AppCard from "./AppCard";
import QuantityStepper from "./QuantityStepper";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import { palette } from "../theme/colors";
import { inter } from "../theme/typography";
import { taka } from "../utils/format";
import { themed } from "../theme/themed";

export default function ProductCard({ product, navigation }) {
  const { cartItems, addToCart, increaseQuantity, decreaseQuantity, removeFromCart } =
    useContext(CartContext);
  const { isInWishlist, toggleWishlist } = useContext(WishlistContext);

  const wishlisted = isInWishlist(product.id);
  const qty = cartItems.find((i) => i.id === product.id)?.quantity || 0;

  const minus = () => (qty <= 1 ? removeFromCart(product.id) : decreaseQuantity(product.id));

  return (
    <AppCard
      padding={0}
      style={styles.card}
      onPress={() => navigation.navigate("ProductDetails", { product })}
    >
      <View>
        <Image source={{ uri: product.image }} style={styles.image} />

        <View style={styles.rating}>
          <MaterialCommunityIcons name="star" color={palette.star} size={14} />
          <Text style={[inter(12, "700", palette.textDark), styles.ratingText]}>
            {product.rating}
          </Text>
        </View>

        <Pressable style={styles.favorite} onPress={() => toggleWishlist(product)} hitSlop={8}>
          <MaterialCommunityIcons
            name={wishlisted ? "heart" : "heart-outline"}
            color={wishlisted ? palette.danger : palette.accent}
            size={20}
          />
        </Pressable>
      </View>

      <View style={styles.body}>
        <Text numberOfLines={2} style={[inter(14, "700", palette.textDark), styles.name]}>
          {product.name}
        </Text>

        <View style={styles.metaRow}>
          <Text style={inter(11, "500", palette.textMuted)} numberOfLines={1}>
            {product.category}
          </Text>
          {product.unit ? (
            <View style={styles.unitPill}>
              <Text style={inter(10, "700", palette.accent)}>{product.unit}</Text>
            </View>
          ) : null}
        </View>

        <Text style={inter(16, "800", palette.price)}>{taka(product.price)}</Text>

        <View style={styles.action}>
          {qty === 0 ? (
            <Pressable
              onPress={() => addToCart(product)}
              style={({ pressed }) => [styles.addBtn, pressed && { opacity: 0.85 }]}
            >
              <MaterialCommunityIcons name="cart-plus" size={16} color={palette.cream} />
              <Text style={[inter(12, "700", palette.cream), styles.addText]}>Add to Cart</Text>
            </Pressable>
          ) : (
            <QuantityStepper
              value={qty}
              onMinus={minus}
              onPlus={() => increaseQuantity(product.id)}
            />
          )}
        </View>
      </View>
    </AppCard>
  );
}

const styles = themed(() => ({
  card: { width: "48.5%", marginBottom: 12, overflow: "hidden" },
  image: {
    width: "100%",
    height: 130,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    backgroundColor: "rgba(27,90,75,0.08)",
  },
  rating: {
    position: "absolute",
    top: 8,
    left: 8,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: palette.surface,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  ratingText: { marginLeft: 3 },
  favorite: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: palette.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  body: { paddingHorizontal: 10, paddingTop: 8, paddingBottom: 10 },
  name: { minHeight: 36 },
  metaRow: { flexDirection: "row", alignItems: "center", marginVertical: 4, flexWrap: "wrap" },
  unitPill: {
    backgroundColor: palette.greenCardFill,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 1,
    marginLeft: 6,
  },
  action: { marginTop: 8, minHeight: 36, justifyContent: "center" },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: palette.teal,
    borderRadius: 10,
    paddingVertical: 8,
  },
  addText: { marginLeft: 6 },
}));