import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { CartContext } from "../context/CartContext";

export default function ProductDetailsScreen({
  route,
  navigation,
}) {
  const { product } = route.params;

  const { addToCart } = useContext(CartContext);

  const [quantity, setQuantity] = useState(1);

  return (
    <LinearGradient
      colors={["#FFF7E7", "#E8FFD8", "#FFF8EC"]}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}

          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <MaterialCommunityIcons
                name="arrow-left"
                size={28}
                color="#2E7D32"
              />
            </TouchableOpacity>

            <TouchableOpacity>
              <MaterialCommunityIcons
                name="heart-outline"
                size={28}
                color="#2E7D32"
              />
            </TouchableOpacity>
          </View>

          {/* Image */}

          <Image
            source={{ uri: product.image }}
            style={styles.image}
          />

          {/* Product Info */}

          <View style={styles.content}>
            <Text style={styles.category}>
              {product.category}
            </Text>

            <Text style={styles.title}>
              {product.name}
            </Text>

            {/* Rating */}

            <View style={styles.ratingRow}>
              <MaterialCommunityIcons
                name="star"
                color="#FFD54F"
                size={22}
              />

              <Text style={styles.rating}>
                {product.rating}
              </Text>

              <Text style={styles.stock}>
                • {product.stock} in stock
              </Text>
            </View>

            {/* Price */}

            <Text style={styles.price}>
              ${product.price.toFixed(2)}
            </Text>

            {/* Description */}

            <Text style={styles.section}>
              Description
            </Text>

            <Text style={styles.description}>
              {product.description}
            </Text>

            {/* Quantity */}

            <Text style={styles.section}>
              Quantity
            </Text>

            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={styles.qtyButton}
                onPress={() =>
                  quantity > 1 &&
                  setQuantity(quantity - 1)
                }
              >
                <MaterialCommunityIcons
                  name="minus"
                  size={20}
                />
              </TouchableOpacity>

              <Text style={styles.quantity}>
                {quantity}
              </Text>

              <TouchableOpacity
                style={styles.qtyButton}
                onPress={() =>
                  setQuantity(quantity + 1)
                }
              >
                <MaterialCommunityIcons
                  name="plus"
                  size={20}
                />
              </TouchableOpacity>
            </View>

            {/* Buttons */}

            <TouchableOpacity
              style={styles.cartButton}
              onPress={() => {
                for (let i = 0; i < quantity; i++) {
                  addToCart(product);
                }

                navigation.navigate("Cart");
              }}
            >
              <MaterialCommunityIcons
                name="cart-plus"
                color="white"
                size={22}
              />

              <Text style={styles.cartText}>
                Add to Cart
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.buyButton}
              onPress={() => navigation.navigate("Checkout")}
            >
              <Text style={styles.buyText}>
                Buy Now
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
  },

  image: {
    width: "100%",
    height: 320,
    resizeMode: "cover",
  },

  content: {
    backgroundColor: "white",
    marginTop: -25,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 25,
  },

  category: {
    color: "#2E7D32",
    fontWeight: "600",
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 5,
    color: "#222",
  },

  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },

  rating: {
    marginLeft: 6,
    fontWeight: "bold",
  },

  stock: {
    marginLeft: 10,
    color: "green",
  },

  price: {
    fontSize: 32,
    color: "#FF9800",
    fontWeight: "bold",
    marginVertical: 20,
  },

  section: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },

  description: {
    color: "#666",
    marginTop: 10,
    lineHeight: 22,
  },

  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
  },

  qtyButton: {
    width: 40,
    height: 40,
    backgroundColor: "#E8F5E9",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  quantity: {
    marginHorizontal: 25,
    fontSize: 20,
    fontWeight: "bold",
  },

  cartButton: {
    backgroundColor: "#2E7D32",
    marginTop: 35,
    padding: 18,
    borderRadius: 18,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  cartText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
    marginLeft: 10,
  },

  buyButton: {
    backgroundColor: "#FF9800",
    padding: 18,
    borderRadius: 18,
    alignItems: "center",
    marginTop: 15,
    marginBottom: 20,
  },

  buyText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});