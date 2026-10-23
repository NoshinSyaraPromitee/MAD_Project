import React, { useContext, useState } from "react";
import { Image, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import GradientBackground from "../components/GradientBackground";
import BackButton from "../components/BackButton";
import AppButton from "../components/AppButton";
import QuantityStepper from "../components/QuantityStepper";
import SectionTitle from "../components/SectionTitle";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import reviewsData from "../data/reviews";
import { palette, tealA } from "../theme/colors";
import { fredoka, inter } from "../theme/typography";
import { shadow } from "../theme/theme";
import { BULLET, DOT, TIMES, taka } from "../utils/format";
import { themed } from "../theme/themed";

export default function ProductDetailsScreen({ route, navigation }) {
  const { product } = route.params;

  const { addToCart } = useContext(CartContext);
  const { isInWishlist, toggleWishlist } = useContext(WishlistContext);

  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState(reviewsData[product.id] || []);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState("");

  const wishlisted = isInWishlist(product.id);

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : product.rating;

  const canSubmit = newRating > 0 && newComment.trim() !== "";

  const submitReview = () => {
    if (!canSubmit) return;
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

  const stars = (value, size) =>
    [1, 2, 3, 4, 5].map((star) => (
      <MaterialCommunityIcons
        key={star}
        name={star <= value ? "star" : "star-outline"}
        size={size}
        color={palette.star}
      />
    ));

  return (
    <GradientBackground>
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View>
          <Image source={{ uri: product.image }} style={styles.image} />
          <SafeAreaView edges={["top"]} style={styles.headerOverlay}>
            <BackButton />
            <Pressable style={styles.circleBtn} onPress={() => toggleWishlist(product)} hitSlop={8}>
              <MaterialCommunityIcons
                name={wishlisted ? "heart" : "heart-outline"}
                size={22}
                color={wishlisted ? palette.danger : palette.accent}
              />
            </Pressable>
          </SafeAreaView>
        </View>

        <View style={styles.sheet}>
          <Text style={inter(13, "700", palette.accent, { letterSpacing: 0.6 })}>
            {String(product.category).toUpperCase()}
          </Text>
          <Text style={[fredoka(28, "700", palette.ink), styles.title]}>{product.name}</Text>

          <View style={styles.ratingRow}>
            <MaterialCommunityIcons name="star" color={palette.star} size={20} />
            <Text style={[inter(14, "800", palette.textDark), styles.ml6]}>{averageRating}</Text>
            <Text style={[inter(13, "500", palette.textMuted), styles.ml6]}>
              ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
            </Text>
            <Text style={[inter(13, "700", "#43A047"), styles.ml10]}>
              {BULLET} {product.stock} in stock
            </Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={[fredoka(32, "700", palette.price), styles.mr12]}>{taka(product.price)}</Text>
            {product.unit ? (
              <View style={styles.unitPill}>
                <MaterialCommunityIcons name="scale-balance" size={14} color={palette.accent} />
                <Text style={[inter(13, "700", palette.accent), styles.ml6]}>{product.unit}</Text>
              </View>
            ) : null}
          </View>

          <SectionTitle title="Description" onCard />
          <Text style={inter(14, "500", palette.textMuted, { lineHeight: 22 })}>
            {product.description}
          </Text>

          <SectionTitle title="Quantity" onCard />
          <View style={styles.quantityRow}>
            <QuantityStepper
              size={42}
              value={quantity}
              onMinus={() => quantity > 1 && setQuantity(quantity - 1)}
              onPlus={() => setQuantity(quantity + 1)}
            />
            {product.unit ? (
              <Text style={[inter(13, "500", palette.textMuted), styles.ml10]}>
                = {quantity} {TIMES} {product.unit}
              </Text>
            ) : null}
          </View>

          <AppButton
            label="Add to Cart"
            leftIcon="cart-plus"
            style={styles.mt24}
            onPress={() => {
              for (let i = 0; i < quantity; i++) addToCart(product);
              navigation.navigate("Cart");
            }}
          />
          <AppButton
            label="Buy Now"
            variant="orange"
            style={styles.mt12}
            onPress={() => navigation.navigate("Checkout")}
          />

          <SectionTitle
            title="Reviews"
            onCard
            style={styles.mt12}
            right={
              <View style={styles.summaryPill}>
                <MaterialCommunityIcons name="star" color={palette.star} size={16} />
                <Text style={[inter(12, "800", palette.warnText), styles.ml4]}>
                  {averageRating} {DOT} {reviews.length}
                </Text>
              </View>
            }
          />

          {reviews.length === 0 ? (
            <Text style={inter(13, "500", palette.textMuted, { fontStyle: "italic" })}>
              No reviews yet. Be the first to share your experience!
            </Text>
          ) : (
            reviews.map((review) => (
              <View key={review.id} style={styles.reviewCard}>
                <View style={styles.reviewTop}>
                  <View style={styles.avatar}>
                    <Text style={inter(14, "800", palette.cream)}>
                      {review.name.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.reviewMeta}>
                    <Text style={inter(14, "700", palette.textDark)}>{review.name}</Text>
                    <Text style={inter(11, "500", palette.textMuted)}>{review.date}</Text>
                  </View>
                  <View style={styles.row}>{stars(review.rating, 14)}</View>
                </View>
                <Text style={[inter(13, "500", palette.textDark, { lineHeight: 19 }), styles.mt8]}>
                  {review.comment}
                </Text>
              </View>
            ))
          )}

          <SectionTitle title="Write a Review" onCard />
          <View style={styles.addReview}>
            <Text style={[inter(13, "600", palette.textMuted), styles.mb8]}>Your rating</Text>
            <View style={[styles.row, styles.mb12]}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Pressable key={star} onPress={() => setNewRating(star)} hitSlop={4}>
                  <MaterialCommunityIcons
                    name={star <= newRating ? "star" : "star-outline"}
                    size={30}
                    color={palette.star}
                    style={styles.mr4}
                  />
                </Pressable>
              ))}
            </View>

            <TextInput
              placeholder="Share your experience with this product..."
              placeholderTextColor={palette.textMuted}
              style={styles.reviewInput}
              multiline
              value={newComment}
              onChangeText={setNewComment}
            />

            <AppButton
              label="Submit Review"
              disabled={!canSubmit}
              onPress={submitReview}
              style={styles.mt12}
            />
          </View>
        </View>
      </ScrollView>
    </GradientBackground>
  );
}

const styles = themed(() => ({
  image: { width: "100%", height: 320, backgroundColor: tealA(0.2) },
  headerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  circleBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: palette.surface,
    borderWidth: 2,
    borderColor: palette.accent,
    alignItems: "center",
    justifyContent: "center",
    ...shadow(4),
  },
  sheet: {
    marginTop: -28,
    backgroundColor: palette.surface,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 48,
  },
  title: { marginTop: 4 },
  row: { flexDirection: "row", alignItems: "center" },
  ratingRow: { flexDirection: "row", alignItems: "center", flexWrap: "wrap", marginTop: 8 },
  priceRow: { flexDirection: "row", alignItems: "center", marginTop: 14 },
  unitPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: palette.greenCardFill,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  quantityRow: { flexDirection: "row", alignItems: "center", flexWrap: "wrap" },
  summaryPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: palette.warnBg,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  reviewCard: {
    backgroundColor: palette.surfaceAlt,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: palette.greenCardFill,
  },
  reviewTop: { flexDirection: "row", alignItems: "center" },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: palette.teal,
    alignItems: "center",
    justifyContent: "center",
  },
  reviewMeta: { flex: 1, marginLeft: 10 },
  addReview: {
    backgroundColor: palette.surfaceAlt,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: palette.greenCardFill,
  },
  reviewInput: {
    backgroundColor: palette.surface,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: palette.greenCardFill,
    padding: 12,
    minHeight: 80,
    textAlignVertical: "top",
    ...inter(14, "500", palette.textDark),
  },
  ml4: { marginLeft: 4 },
  ml6: { marginLeft: 6 },
  ml10: { marginLeft: 10 },
  mr4: { marginRight: 4 },
  mr12: { marginRight: 12 },
  mt8: { marginTop: 8 },
  mt12: { marginTop: 12 },
  mt24: { marginTop: 24 },
  mb8: { marginBottom: 8 },
  mb12: { marginBottom: 12 },
}));