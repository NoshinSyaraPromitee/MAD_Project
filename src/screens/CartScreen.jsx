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

import { CartContext } from "../context/CartContext";

export default function CartScreen({ navigation }) {
  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    totalPrice,
  } = useContext(CartContext);

  const shipping = cartItems.length > 0 ? 5.99 : 0;
  const tax = totalPrice * 0.05;
  const grandTotal = totalPrice + shipping + tax;

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image
        source={{ uri: item.image }}
        style={styles.image}
      />

      <View style={styles.info}>
        <Text style={styles.name}>
          {item.name}
        </Text>

        <Text style={styles.category}>
          {item.category}
        </Text>

        <Text style={styles.price}>
          ${item.price.toFixed(2)}
        </Text>

        <View style={styles.quantityRow}>
          <TouchableOpacity
            style={styles.qtyButton}
            onPress={() =>
              decreaseQuantity(item.id)
            }
          >
            <MaterialCommunityIcons
              name="minus"
              size={18}
            />
          </TouchableOpacity>

          <Text style={styles.quantity}>
            {item.quantity}
          </Text>

          <TouchableOpacity
            style={styles.qtyButton}
            onPress={() =>
              increaseQuantity(item.id)
            }
          >
            <MaterialCommunityIcons
              name="plus"
              size={18}
            />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        onPress={() =>
          removeFromCart(item.id)
        }
      >
        <MaterialCommunityIcons
          name="delete-outline"
          size={28}
          color="#E53935"
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <LinearGradient
      colors={["#FFF7E7", "#E8FFD8", "#FFF8EC"]}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>

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

          <Text style={styles.headerTitle}>
            My Cart
          </Text>

          <View style={{ width: 28 }} />
        </View>

        {cartItems.length === 0 ? (
          <View style={styles.empty}>
            <MaterialCommunityIcons
              name="cart-outline"
              size={90}
              color="#BBBBBB"
            />

            <Text style={styles.emptyTitle}>
              Your cart is empty
            </Text>

            <TouchableOpacity
              style={styles.shopButton}
              onPress={() =>
                navigation.navigate("Shop")
              }
            >
              <Text style={styles.shopText}>
                Continue Shopping
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <FlatList
              data={cartItems}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              contentContainerStyle={{
                padding: 20,
              }}
            />

            {/* Summary */}

            <View style={styles.summary}>
              <View style={styles.row}>
                <Text>Subtotal</Text>

                <Text>
                  ${totalPrice.toFixed(2)}
                </Text>
              </View>

              <View style={styles.row}>
                <Text>Shipping</Text>

                <Text>
                  ${shipping.toFixed(2)}
                </Text>
              </View>

              <View style={styles.row}>
                <Text>Tax</Text>

                <Text>
                  ${tax.toFixed(2)}
                </Text>
              </View>

              <View
                style={styles.divider}
              />

              <View style={styles.row}>
                <Text style={styles.total}>
                  Total
                </Text>

                <Text style={styles.total}>
                  ${grandTotal.toFixed(2)}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.checkoutButton}
                onPress={() =>
                  navigation.navigate(
                    "Checkout"
                  )
                }
              >
                <Text
                  style={
                    styles.checkoutText
                  }
                >
                  Proceed to Checkout
                </Text>
              </TouchableOpacity>
            </View>
          </>
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
    fontSize: 18,
    fontWeight: "bold",
  },

  category: {
    color: "#777",
    marginVertical: 5,
  },

  price: {
    color: "#FF9800",
    fontWeight: "bold",
    fontSize: 18,
  },

  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },

  qtyButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#E8F5E9",
    justifyContent: "center",
    alignItems: "center",
  },

  quantity: {
    marginHorizontal: 15,
    fontWeight: "bold",
    fontSize: 18,
  },

  summary: {
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 25,
    elevation: 20,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  divider: {
    borderBottomWidth: 1,
    borderColor: "#DDD",
    marginVertical: 10,
  },

  total: {
    fontSize: 20,
    fontWeight: "bold",
  },

  checkoutButton: {
    backgroundColor: "#2E7D32",
    marginTop: 20,
    padding: 18,
    borderRadius: 18,
    alignItems: "center",
  },

  checkoutText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },

  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  emptyTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 20,
    color: "#666",
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