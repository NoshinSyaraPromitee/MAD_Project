import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  View,
} from "react-native";

import AppScreen from "../components/AppScreen";
import ChatBubble from "../components/ChatBubble.jsx";
import ChatInput from "../components/ChatInput.jsx";
import { analyzePlantImage, getBotResponse } from "../services/chatApi";
import { palette, creamA } from "../theme/colors";
import { inter } from "../theme/typography";
import { themed } from "../theme/themed";

export default function AIChatScreen() {
  const [messages, setMessages] = useState([
    {
      id: "1",
      sender: "bot",
      text: "Hello! I'm PlantBot.\nHow can I help your plants today?",
      suggestedChips: [
        "Why are my leaves yellow?",
        "Homemade Banana Fertilizer",
        "Treat Leaf Spot",
      ],
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async ({ text, imageUri }) => {
    if (!text?.trim() && !imageUri) return;

    const userMsg = {
      id: String(Date.now()),
      sender: "user",
      text: text?.trim() || (imageUri ? "\uD83D\uDCF7 Photo sent" : ""),
      imageUri: imageUri || null,
    };

    setMessages((prev) => [userMsg, ...prev]);
    setIsTyping(true);

    try {
      const botMsg = imageUri
        ? await analyzePlantImage(imageUri, text?.trim())
        : await getBotResponse(text.trim());

      setMessages((prev) => [botMsg, ...prev]);
    } catch (error) {
      console.error("Error getting bot response:", error);
      setMessages((prev) => [
        {
          id: String(Date.now() + 1),
          sender: "bot",
          text: "Something went wrong on my end. Please try again.",
        },
        ...prev,
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleChipPress = (chipText) => {
    handleSend({ text: chipText, imageUri: null });
  };

  return (
    <AppScreen title="AI Doctor" padded={false} edges={["top"]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ChatBubble message={item} onChipPress={handleChipPress} />
          )}
          inverted
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />

        {isTyping ? (
          <View style={styles.typingBox}>
            <ActivityIndicator size="small" color={palette.cream} />
            <Text style={[inter(13, "600", palette.cream), styles.typingText]}>
              PlantBot is analyzing...
            </Text>
          </View>
        ) : null}

        <ChatInput onSendMessage={handleSend} />
      </KeyboardAvoidingView>
    </AppScreen>
  );
}

const styles = themed(() => ({
  flex: { flex: 1 },
  listContent: { paddingHorizontal: 16, paddingVertical: 12 },
  typingBox: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginLeft: 16,
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(27,90,75,0.55)",
    borderWidth: 1,
    borderColor: creamA(0.4),
  },
  typingText: { marginLeft: 8 },
}));