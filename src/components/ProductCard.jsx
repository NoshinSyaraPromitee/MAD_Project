import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { CartContext } from "../context/CartContext";

export default function ProductCard({
  product,
  navigation,
}) {
  const { addToCart } = useContext(CartContext);

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={styles.card}
      onPress={() =>
        navigation.navigate("ProductDetails", {
          product,
        })
      }
    >
      {/* Product Image */}

      <Image
        source={{ uri: product.image }}
        style={styles.image}
      />

      {/* Rating */}

      <View style={styles.rating}>
        <MaterialCommunityIcons
          name="star"
          color="#FFD54F"
          size={15}
        />

        <Text style={styles.ratingText}>
          {product.rating}
        </Text>
      </View>

      {/* Wishlist */}

      <TouchableOpacity style={styles.favorite}>
        <MaterialCommunityIcons
          name="heart-outline"
          color="#2E7D32"
          size={22}
        />
      </TouchableOpacity>

      {/* Product Name */}

      <Text numberOfLines={2} style={styles.name}>
        {product.name}
      </Text>

      {/* Category */}

      <Text style={styles.category}>
        {product.category}
      </Text>

      {/* Bottom */}

      <View style={styles.bottomRow}>
        <Text style={styles.price}>
          ${product.price}
        </Text>

        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => addToCart(product)}
        >
          <MaterialCommunityIcons
            name="cart-plus"
            size={20}
            color="white"
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 170,
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    marginBottom: 18,
    padding: 12,

    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 5,
    },

    elevation: 6,
  },

  image: {
    width: "100%",
    height: 150,
    borderRadius: 18,
  },

  rating: {
    position: "absolute",
    top: 18,
    left: 18,

    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 8,
    paddingVertical: 4,

    borderRadius: 20,
  },

  ratingText: {
    marginLeft: 4,
    fontWeight: "600",
  },

  favorite: {
    position: "absolute",
    top: 18,
    right: 18,

    width: 34,
    height: 34,

    backgroundColor: "white",

    justifyContent: "center",
    alignItems: "center",

    borderRadius: 17,
  },

  name: {
    marginTop: 12,
    fontSize: 17,
    fontWeight: "700",
    color: "#2E7D32",
  },

  category: {
    color: "#777",
    marginTop: 4,
    marginBottom: 10,
  },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  price: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#FF9800",
  },

  cartButton: {
    width: 42,
    height: 42,
    borderRadius: 21,

    backgroundColor: "#2E7D32",

    justifyContent: "center",
    alignItems: "center",
  },
});