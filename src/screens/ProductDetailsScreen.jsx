import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import reviewsData from "../data/reviews";

export default function ProductDetailsScreen({
  route,
  navigation,
}) {
  const { product } = route.params;

  const { addToCart } = useContext(CartContext);
  const { isInWishlist, toggleWishlist } = useContext(WishlistContext);

  const [quantity, setQuantity] = useState(1);

  const [reviews, setReviews] = useState(
    reviewsData[product.id] || []
  );

  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState("");

  const wishlisted = isInWishlist(product.id);

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) /
          reviews.length
        ).toFixed(1)
      : product.rating;

  const submitReview = () => {
    if (newRating === 0 || newComment.trim() === "") {
      return;
    }

    const review = {
      id: `local-${Date.now()}`,
      name: "You",
      rating: newRating,
      date: new Date().toISOString().slice(0, 10),
      comment: newComment.trim(),
    };

    setReviews([review, ...reviews]);
    setNewRating(0);
    setNewComment("");
  };

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

            <TouchableOpacity onPress={() => toggleWishlist(product)}>
              <MaterialCommunityIcons
                name={wishlisted ? "heart" : "heart-outline"}
                size={28}
                color={wishlisted ? "#E53935" : "#2E7D32"}
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
                {averageRating}
              </Text>

              <Text style={styles.reviewCount}>
                ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
              </Text>

              <Text style={styles.stock}>
                • {product.stock} in stock
              </Text>
            </View>

            {/* Price + Unit (measurement) */}

            <View style={styles.priceRow}>
              <Text style={styles.price}>
                ৳{product.price.toFixed(2)}
              </Text>

              {product.unit && (
                <View style={styles.unitPill}>
                  <MaterialCommunityIcons
                    name="scale-balance"
                    size={14}
                    color="#2E7D32"
                  />

                  <Text style={styles.unitPillText}>
                    {product.unit}
                  </Text>
                </View>
              )}
            </View>

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
                  size={22}
                  color="#2E7D32"
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
                  size={22}
                  color="#2E7D32"
                />
              </TouchableOpacity>

              {product.unit && (
                <Text style={styles.quantityHint}>
                  = {quantity} × {product.unit}
                </Text>
              )}
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

            {/* Reviews */}

            <View style={styles.reviewsHeaderRow}>
              <Text style={styles.section}>
                Reviews
              </Text>

              <View style={styles.reviewsSummaryPill}>
                <MaterialCommunityIcons
                  name="star"
                  color="#FFD54F"
                  size={16}
                />

                <Text style={styles.reviewsSummaryText}>
                  {averageRating} · {reviews.length}
                </Text>
              </View>
            </View>

            {reviews.length === 0 ? (
              <Text style={styles.noReviews}>
                No reviews yet. Be the first to share your experience!
              </Text>
            ) : (
              reviews.map((review) => (
                <View key={review.id} style={styles.reviewCard}>
                  <View style={styles.reviewTopRow}>
                    <View style={styles.avatar}>
                      <Text style={styles.avatarText}>
                        {review.name.charAt(0).toUpperCase()}
                      </Text>
                    </View>

                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <Text style={styles.reviewerName}>
                        {review.name}
                      </Text>

                      <Text style={styles.reviewDate}>
                        {review.date}
                      </Text>
                    </View>

                    <View style={styles.starsRow}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <MaterialCommunityIcons
                          key={star}
                          name={star <= review.rating ? "star" : "star-outline"}
                          size={14}
                          color="#FFD54F"
                        />
                      ))}
                    </View>
                  </View>

                  <Text style={styles.reviewComment}>
                    {review.comment}
                  </Text>
                </View>
              ))
            )}

            {/* Add a review */}

            <Text style={styles.section}>
              Write a Review
            </Text>

            <View style={styles.addReviewCard}>
              <Text style={styles.addReviewLabel}>
                Your rating
              </Text>

              <View style={styles.starsPickerRow}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity
                    key={star}
                    onPress={() => setNewRating(star)}
                    hitSlop={{ top: 6, bottom: 6, left: 4, right: 4 }}
                  >
                    <MaterialCommunityIcons
                      name={star <= newRating ? "star" : "star-outline"}
                      size={28}
                      color="#FFD54F"
                      style={{ marginRight: 4 }}
                    />
                  </TouchableOpacity>
                ))}
              </View>

              <TextInput
                placeholder="Share your experience with this product..."
                placeholderTextColor="#999"
                style={styles.reviewInput}
                multiline
                value={newComment}
                onChangeText={setNewComment}
              />

              <TouchableOpacity
                style={[
                  styles.submitReviewButton,
                  (newRating === 0 || newComment.trim() === "") &&
                    styles.submitReviewButtonDisabled,
                ]}
                disabled={newRating === 0 || newComment.trim() === ""}
                onPress={submitReview}
              >
                <Text style={styles.submitReviewText}>
                  Submit Review
                </Text>
              </TouchableOpacity>
            </View>
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
    flexWrap: "wrap",
  },

  rating: {
    marginLeft: 6,
    fontWeight: "bold",
  },

  reviewCount: {
    marginLeft: 6,
    color: "#999",
    fontSize: 13,
  },

  stock: {
    marginLeft: 10,
    color: "green",
  },

  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },

  price: {
    fontSize: 32,
    color: "#FF9800",
    fontWeight: "bold",
    marginRight: 12,
  },

  unitPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F5E9",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },

  unitPillText: {
    color: "#2E7D32",
    fontWeight: "700",
    fontSize: 13,
    marginLeft: 5,
  },

  section: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    color: "#222",
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
    flexWrap: "wrap",
  },

  qtyButton: {
    width: 44,
    height: 44,
    backgroundColor: "#E8F5E9",
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: "#2E7D32",
    justifyContent: "center",
    alignItems: "center",
  },

  quantity: {
    marginHorizontal: 22,
    fontSize: 22,
    fontWeight: "bold",
    color: "#222",
    minWidth: 24,
    textAlign: "center",
  },

  quantityHint: {
    marginTop: 8,
    width: "100%",
    color: "#999",
    fontSize: 13,
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
    marginBottom: 10,
  },

  buyText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },

  reviewsHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 25,
  },

  reviewsSummaryPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF8E1",
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },

  reviewsSummaryText: {
    marginLeft: 5,
    fontWeight: "700",
    color: "#8A6D00",
    fontSize: 12,
  },

  noReviews: {
    color: "#999",
    marginTop: 12,
    fontStyle: "italic",
  },

  reviewCard: {
    backgroundColor: "#FAFAFA",
    borderRadius: 16,
    padding: 14,
    marginTop: 14,
  },

  reviewTopRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#2E7D32",
    justifyContent: "center",
    alignItems: "center",
  },

  avatarText: {
    color: "white",
    fontWeight: "bold",
  },

  reviewerName: {
    fontWeight: "700",
    color: "#222",
  },

  reviewDate: {
    color: "#999",
    fontSize: 11,
    marginTop: 1,
  },

  starsRow: {
    flexDirection: "row",
  },

  reviewComment: {
    color: "#555",
    marginTop: 10,
    lineHeight: 19,
  },

  addReviewCard: {
    backgroundColor: "#FAFAFA",
    borderRadius: 16,
    padding: 16,
    marginTop: 14,
    marginBottom: 10,
  },

  addReviewLabel: {
    color: "#666",
    fontWeight: "600",
    marginBottom: 8,
  },

  starsPickerRow: {
    flexDirection: "row",
    marginBottom: 12,
  },

  reviewInput: {
    backgroundColor: "white",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#DDD",
    padding: 12,
    minHeight: 70,
    textAlignVertical: "top",
    color: "#222",
  },

  submitReviewButton: {
    backgroundColor: "#2E7D32",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 12,
  },

  submitReviewButtonDisabled: {
    backgroundColor: "#A5D6A7",
  },

  submitReviewText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 15,
  },
});