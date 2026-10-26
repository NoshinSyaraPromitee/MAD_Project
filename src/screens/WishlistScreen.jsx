import React, { useContext } from "react";
import { FlatList, Image, Pressable, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import AppScreen from "../components/AppScreen";
import AppCard from "../components/AppCard";
import EmptyView from "../components/EmptyView";
import { WishlistContext } from "../context/WishlistContext";
import { CartContext } from "../context/CartContext";
import { palette } from "../theme/colors";
import { inter } from "../theme/typography";
import { taka } from "../utils/format";
import { themed } from "../theme/themed";

export default function WishlistScreen({ navigation }) {
  const { wishlistItems, removeFromWishlist } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);

  const goToShop = () => navigation.navigate("MainTabs", { screen: "Shop" });

  const renderItem = ({ item }) => (
    <AppCard
      style={styles.card}
      padding={12}
      onPress={() => navigation.navigate("ProductDetails", { product: item })}
    >
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

          <View style={styles.actionsRow}>
            <Pressable
              style={({ pressed }) => [styles.cartButton, pressed && { opacity: 0.85 }]}
              onPress={() => addToCart(item)}
            >
              <MaterialCommunityIcons name="cart-plus" size={16} color={palette.cream} />
              <Text style={[inter(12, "700", palette.cream), styles.ml6]}>Add to Cart</Text>
            </Pressable>

            <Pressable style={styles.removeButton} onPress={() => removeFromWishlist(item.id)}>
              <MaterialCommunityIcons name="trash-can-outline" size={20} color={palette.danger} />
            </Pressable>
          </View>
        </View>
      </View>
    </AppCard>
  );

  return (
    <AppScreen title="My Wishlist" padded={false}>
      {wishlistItems.length === 0 ? (
        <EmptyView
          icon="heart-outline"
          title="Your wishlist is empty"
          subtitle="Tap the heart on any product to save it here."
          actionLabel="Browse Shop"
          onAction={goToShop}
        />
      ) : (
        <FlatList
          data={wishlistItems}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
        />
      )}
    </AppScreen>
  );
}

const styles = themed(() => ({
  list: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 24 },
  card: { marginBottom: 12 },
  row: { flexDirection: "row" },
  image: { width: 88, height: 88, borderRadius: 14 },
  info: { flex: 1, marginLeft: 12 },
  metaRow: { flexDirection: "row", alignItems: "center", flexWrap: "wrap", marginVertical: 4 },
  unitPill: {
    backgroundColor: palette.greenCardFill,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 1,
    marginLeft: 6,
  },
  actionsRow: { flexDirection: "row", alignItems: "center", marginTop: 10 },
  cartButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: palette.teal,
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  removeButton: {
    marginLeft: 12,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: palette.dangerBg,
    alignItems: "center",
    justifyContent: "center",
  },
  ml6: { marginLeft: 6 },
}));