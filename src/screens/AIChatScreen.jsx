import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    View
} from "react-native";

import ChatBubble from "../components/ChatBubble.jsx";
import ChatInput from "../components/ChatInput.jsx";
import { analyzePlantImage, getBotResponse } from "../services/chatApi";

export default function AIChatScreen() {
  const [messages, setMessages] = useState([
    {
      id: "1",
      sender: "bot",
      text: "Hello! I'm PlantBot.\nHow can I help your plants today?",
      suggestedChips: [
        "Why are my leaves yellow?",
        "Homemade Banana Fertilizer",
        "Treat Leaf Spot"
      ]
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async ({ text, imageUri }) => {
    if (!text?.trim() && !imageUri) return;

    const userMsg = {
      id: String(Date.now()),
      sender: "user",
      text: text?.trim() || (imageUri ? "📷 Photo sent" : ""),
      imageUri: imageUri || null
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
          text: "Something went wrong on my end. Please try again."
        },
        ...prev
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleChipPress = (chipText) => {
    handleSend({ text: chipText, imageUri: null });
  };

  return (
    <LinearGradient
      colors={["#FFF7E7", "#E8FFD8", "#FFF8EC"]}
      style={styles.gradientContainer}
    >
      <SafeAreaView style={styles.container}>
        {/* Chat Feed */}
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ChatBubble message={item} onChipPress={handleChipPress} />
          )}
          inverted
          contentContainerStyle={styles.listContent}
        />

        {isTyping && (
          <View style={styles.typingBox}>
            <ActivityIndicator size="small" color="#2E7D32" />
            <Text style={styles.typingText}>PlantBot is analyzing...</Text>
          </View>
        )}

        {/* Modular Input Bar (+ Icon, Image Preview, & Send Button) */}
        <ChatInput onSendMessage={handleSend} />
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1
  },
  container: {
    flex: 1,
    justifyContent: "space-between"
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 12
  },
  typingBox: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 8
  },
  typingText: {
    fontSize: 13,
    color: "#7A7A7A",
    marginLeft: 8,
    fontWeight: "500"
  }
});