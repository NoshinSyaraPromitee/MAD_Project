import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

// Animated mascot — uses the pot-character GIF.
export default function PlantBuddy({ message }) {
  return (
    <View style={styles.wrapper}>
      {message ? (
        <View style={styles.bubble}>
          <Text style={styles.bubbleText}>{message}</Text>
          <View style={styles.bubbleTail} />
        </View>
      ) : null}

      <Image
        source={require("../../assets/images/pot-character.gif")}
        style={styles.character}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    marginBottom: 10,
  },

  character: {
    width: 160,
    height: 160,
  },

  bubble: {
    backgroundColor: "white",
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 18,
    maxWidth: 260,
    marginBottom: 6,
    elevation: 4,
  },

  bubbleText: {
    color: "#333",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },

  bubbleTail: {
    position: "absolute",
    bottom: -8,
    left: "50%",
    marginLeft: -8,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 10,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "white",
  },
});