import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { WishlistContext } from "../context/WishlistContext";
import { CartContext } from "../context/CartContext";

export default function WishlistScreen({ navigation }) {
  const { wishlistItems, removeFromWishlist } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);

  const goToShop = () => {
    navigation.navigate("MainTabs", { screen: "Shop" });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.9}
      onPress={() =>
        navigation.navigate("ProductDetails", { product: item })
      }
    >
      <Image
        source={{ uri: item.image }}
        style={styles.image}
      />

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>
          {item.name}
        </Text>

        <View style={styles.metaRow}>
          <Text style={styles.category}>
            {item.category}
          </Text>

          {item.unit && (
            <View style={styles.unitPill}>
              <Text style={styles.unitText}>
                {item.unit}
              </Text>
            </View>
          )}
        </View>

        <Text style={styles.price}>
          ৳{item.price.toFixed(2)}
        </Text>

        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.cartButton}
            onPress={() => addToCart(item)}
          >
            <MaterialCommunityIcons
              name="cart-plus"
              size={16}
              color="white"
            />

            <Text style={styles.cartButtonText}>
              Add to Cart
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => removeFromWishlist(item.id)}
          >
            <MaterialCommunityIcons
              name="trash-can-outline"
              size={20}
              color="#E53935"
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={["#FFF7E7", "#E8FFD8", "#FFF8EC"]}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}

        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons
              name="arrow-left"
              size={28}
              color="#2E7D32"
            />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            My Wishlist
          </Text>

          <View style={{ width: 28 }} />
        </View>

        {wishlistItems.length === 0 ? (
          <View style={styles.empty}>
            <MaterialCommunityIcons
              name="heart-outline"
              size={90}
              color="#BBBBBB"
            />

            <Text style={styles.emptyTitle}>
              Your wishlist is empty
            </Text>

            <Text style={styles.emptySubtitle}>
              Tap the heart on any product to save it here.
            </Text>

            <TouchableOpacity
              style={styles.shopButton}
              onPress={goToShop}
            >
              <Text style={styles.shopText}>
                Browse Shop
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={wishlistItems}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ padding: 20 }}
          />
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2E7D32",
  },

  card: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 15,
    marginBottom: 15,
    flexDirection: "row",
    elevation: 4,
  },

  image: {
    width: 90,
    height: 90,
    borderRadius: 15,
  },

  info: {
    flex: 1,
    marginLeft: 15,
  },

  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#222",
  },

  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: 5,
  },

  category: {
    color: "#777",
    marginRight: 6,
    fontSize: 13,
  },

  unitPill: {
    backgroundColor: "#E8F5E9",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },

  unitText: {
    color: "#2E7D32",
    fontSize: 11,
    fontWeight: "700",
  },

  price: {
    color: "#FF9800",
    fontWeight: "bold",
    fontSize: 17,
    marginTop: 6,
  },

  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },

  cartButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2E7D32",
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },

  cartButtonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 12,
    marginLeft: 6,
  },

  removeButton: {
    marginLeft: 12,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#FDECEA",
    justifyContent: "center",
    alignItems: "center",
  },

  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },

  emptyTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 20,
    color: "#666",
  },

  emptySubtitle: {
    color: "#999",
    marginTop: 8,
    textAlign: "center",
  },

  shopButton: {
    marginTop: 30,
    backgroundColor: "#2E7D32",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 20,
  },

  shopText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});