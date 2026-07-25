import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { fertilizerSafetyTips } from "../data/fertilizers";

export default function FertilizerDetailsScreen({ route, navigation }) {
  const { fertilizer } = route.params;

  return (
    <LinearGradient
      colors={["#FFF7E7", "#E8FFD8", "#FFF8EC"]}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header image */}

          <View>
            <Image
              source={{ uri: fertilizer.image }}
              style={styles.heroImage}
            />

            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <MaterialCommunityIcons
                name="arrow-left"
                size={24}
                color="#2E7D32"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <Text style={styles.title}>{fertilizer.name}</Text>

            <View style={styles.purposeRow}>
              <MaterialCommunityIcons name="target" size={16} color="#2E7D32" />
              <Text style={styles.purpose}>{fertilizer.purpose}</Text>
            </View>

            <View style={styles.tag}>
              <MaterialCommunityIcons name="molecule" size={14} color="#558B2F" />
              <Text style={styles.tagText}>{fertilizer.nutrient}</Text>
            </View>

            {/* Ingredients */}

            <Text style={styles.sectionTitle}>Ingredients</Text>

            <View style={styles.card}>
              {fertilizer.ingredients.map((ingredient) => (
                <View key={ingredient} style={styles.listRow}>
                  <MaterialCommunityIcons
                    name="circle-small"
                    size={22}
                    color="#43A047"
                  />

                  <Text style={styles.listText}>{ingredient}</Text>
                </View>
              ))}
            </View>

            {/* Preparation */}

            <Text style={styles.sectionTitle}>Preparation</Text>

            <View style={styles.card}>
              {fertilizer.preparation.map((step, index) => (
                <View key={step} style={styles.stepRow}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>{index + 1}</Text>
                  </View>

                  <Text style={styles.listText}>{step}</Text>
                </View>
              ))}
            </View>

            {/* Application */}

            <Text style={styles.sectionTitle}>Application</Text>

            <View style={styles.card}>
              <View style={styles.listRow}>
                <MaterialCommunityIcons
                  name="watering-can-outline"
                  size={20}
                  color="#42A5F5"
                />

                <Text style={styles.listText}>{fertilizer.application}</Text>
              </View>
            </View>

            {/* Benefits */}

            <Text style={styles.sectionTitle}>Benefits</Text>

            <View style={styles.card}>
              {fertilizer.benefits.map((benefit) => (
                <View key={benefit} style={styles.listRow}>
                  <MaterialCommunityIcons
                    name="check-circle"
                    size={18}
                    color="#43A047"
                  />

                  <Text style={styles.listText}>{benefit}</Text>
                </View>
              ))}
            </View>

            {/* Safety Tips */}

            <Text style={styles.sectionTitle}>Safety Tips</Text>

            <View style={[styles.card, styles.safetyCard]}>
              {fertilizerSafetyTips.map((tip) => (
                <View key={tip} style={styles.listRow}>
                  <MaterialCommunityIcons
                    name="alert-outline"
                    size={18}
                    color="#FB8C00"
                  />

                  <Text style={styles.listText}>{tip}</Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  heroImage: {
    width: "100%",
    height: 240,
    backgroundColor: "#EEE",
  },

  backButton: {
    position: "absolute",
    top: 16,
    left: 16,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },

  content: {
    padding: 20,
    paddingTop: 22,
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#222",
  },

  purposeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },

  purpose: {
    marginLeft: 6,
    color: "#2E7D32",
    fontWeight: "600",
  },

  tag: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#F1F8E9",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginTop: 12,
  },

  tagText: {
    marginLeft: 5,
    fontSize: 12,
    color: "#558B2F",
    fontWeight: "600",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 26,
    marginBottom: 12,
  },

  card: {
    backgroundColor: "white",
    borderRadius: 18,
    padding: 16,
    elevation: 3,
  },

  safetyCard: {
    backgroundColor: "#FFF8E1",
  },

  listRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },

  listText: {
    flex: 1,
    marginLeft: 8,
    color: "#444",
    lineHeight: 20,
  },

  stepRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 14,
  },

  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#2E7D32",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  stepNumberText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
});