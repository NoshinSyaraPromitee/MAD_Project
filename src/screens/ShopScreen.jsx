import React, { useContext, useState } from "react";
import { FlatList, Pressable, ScrollView, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import AppScreen from "../components/AppScreen";
import SearchBar from "../components/SearchBar";
import EmptyView from "../components/EmptyView";
import ProductCard from "../components/ProductCard";
import products from "../data/products";
import categories from "../data/categories";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import { palette } from "../theme/colors";
import { inter } from "../theme/typography";
import { shadow } from "../theme/theme";
import { themed } from "../theme/themed";

function IconWithBadge({ icon, count, onPress }) {
  return (
    <Pressable onPress={onPress} hitSlop={6} style={({ pressed }) => [styles.iconBtn, pressed && { opacity: 0.8 }]}>
      <MaterialCommunityIcons name={icon} size={22} color={palette.accent} />
      {count > 0 ? (
        <View style={styles.badge}>
          <Text style={inter(10, "800", palette.white)}>{count}</Text>
        </View>
      ) : null}
    </Pressable>
  );
}

export default function ShopScreen({ navigation }) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");

  const { cartItems } = useContext(CartContext);
  const { wishlistItems } = useContext(WishlistContext);

  const filteredProducts = products.filter((item) => {
    const categoryMatch = selectedCategory === "All" || item.category === selectedCategory;
    const searchMatch = item.name.toLowerCase().includes(search.toLowerCase());
    return categoryMatch && searchMatch;
  });

  const chip = (name) => {
    const selected = selectedCategory === name;
    return (
      <Pressable
        key={name}
        onPress={() => setSelectedCategory(name)}
        style={[styles.category, selected && styles.categoryOn]}
      >
        <Text style={inter(13, "700", selected ? palette.cream : palette.textDark)}>{name}</Text>
      </Pressable>
    );
  };

  return (
    <AppScreen
      title="Shop"
      edges={["top"]}
      sideWidth={100}
      trailing={
        <View style={styles.headerIcons}>
          <IconWithBadge
            icon="heart-outline"
            count={wishlistItems.length}
            onPress={() => navigation.navigate("Wishlist")}
          />
          <IconWithBadge
            icon="cart-outline"
            count={cartItems.length}
            onPress={() => navigation.navigate("Cart")}
          />
        </View>
      }
    >
  

      <SearchBar value={search} onChangeText={setSearch} placeholder="Search products..." />

      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categories}
        >
          {chip("All")}
          {categories.map((item) => chip(item.name))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        columnWrapperStyle={styles.column}
        renderItem={({ item }) => <ProductCard product={item} navigation={navigation} />}
        ListEmptyComponent={<EmptyView icon="storefront-outline" title="No products found" light />}
      />
    </AppScreen>
  );
}

const styles = themed(() => ({
  headerIcons: { flexDirection: "row", gap: 8 },
  iconBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: palette.surface,
    borderWidth: 2,
    borderColor: palette.accent,
    alignItems: "center",
    justifyContent: "center",
    ...shadow(3),
  },
  badge: {
    position: "absolute",
    top: -5,
    right: -5,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 4,
    backgroundColor: palette.danger,
    alignItems: "center",
    justifyContent: "center",
  },
  subtitle: { textAlign: "center", marginBottom: 12 },
  categories: { paddingBottom: 12, gap: 8 },
  category: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: palette.surface,
    borderWidth: 1.5,
    borderColor: palette.edge,
  },
  categoryOn: { backgroundColor: palette.teal },
  list: { paddingBottom: 24 },
  column: { justifyContent: "space-between" },
}));