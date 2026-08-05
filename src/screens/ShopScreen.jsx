import React, { useContext, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import ProductCard from "../components/ProductCard";

import products from "../data/products";
import categories from "../data/categories";

import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";

export default function ShopScreen({ navigation }) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");

  const { cartItems } = useContext(CartContext);
  const { wishlistItems } = useContext(WishlistContext);

  const filteredProducts = products.filter((item) => {
    const categoryMatch =
      selectedCategory === "All" ||
      item.category === selectedCategory;

    const searchMatch = item.name
      .toLowerCase()
      .includes(search.toLowerCase());

    return categoryMatch && searchMatch;
  });

  return (
    <LinearGradient
      colors={["#FFF7E7", "#E8FFD8", "#FFF8EC"]}
      style={styles.container}
    >
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}

        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <MaterialCommunityIcons
                name="arrow-left"
                size={28}
                color="#2E7D32"
              />
            </TouchableOpacity>

            <View>
              <Text style={styles.smallText}>Store</Text>
              <Text style={styles.title}>
                Find Your necessary gardening equipment
              </Text>
            </View>
          </View>

          <View style={styles.headerIcons}>
            <TouchableOpacity
              onPress={() => navigation.navigate("Wishlist")}
              style={{ marginRight: 18 }}
            >
              <View>
                <MaterialCommunityIcons
                  name="heart-outline"
                  size={30}
                  color="#2E7D32"
                />

                {wishlistItems.length > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                      {wishlistItems.length}
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate("Cart")}
            >
              <View>
                <MaterialCommunityIcons
                  name="cart-outline"
                  size={34}
                  color="#2E7D32"
                />

                {cartItems.length > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                      {cartItems.length}
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Search */}

        <View style={styles.searchContainer}>
          <MaterialCommunityIcons
            name="magnify"
            size={24}
            color="#777"
          />

          <TextInput
            placeholder="Search plants..."
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Categories */}

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 20,
          }}
        >
          <TouchableOpacity
            onPress={() => setSelectedCategory("All")}
            style={[
              styles.category,
              selectedCategory === "All" &&
                styles.selectedCategory,
            ]}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === "All" &&
                  styles.selectedText,
              ]}
            >
              All
            </Text>
          </TouchableOpacity>

          {categories.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.category,
                selectedCategory === item.name &&
                  styles.selectedCategory,
              ]}
              onPress={() =>
                setSelectedCategory(item.name)
              }
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === item.name &&
                    styles.selectedText,
                ]}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Products */}

        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          columnWrapperStyle={{
            justifyContent: "space-between",
          }}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              navigation={navigation}
            />
          )}
        />
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 15,
    marginBottom: 20,
  },

  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  backButton: {
    marginRight: 12,
    padding: 4,
  },

  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
  },

  smallText: {
    color: "#666",
    fontSize: 16,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2E7D32",
    marginTop: 5,
  },

  searchContainer: {
    marginHorizontal: 20,
    backgroundColor: "#fff",
    borderRadius: 18,
    height: 55,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    marginBottom: 20,
    elevation: 3,
  },

  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },

  category: {
    backgroundColor: "#fff",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 15,
    elevation: 2,
  },

  selectedCategory: {
    backgroundColor: "#2E7D32",
  },

  categoryText: {
    color: "#333",
    fontWeight: "600",
  },

  selectedText: {
    color: "#fff",
  },

  list: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },

  badge: {
    position: "absolute",
    right: -6,
    top: -6,
    backgroundColor: "#FF9800",
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  badgeText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 11,
  },
});