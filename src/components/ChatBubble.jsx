import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import MarkdownText from "./MarkdownText";
import { palette } from "../theme/colors";
import { inter } from "../theme/typography";
import { shadow } from "../theme/theme";
import { BULLET } from "../utils/format";
import { themed } from "../theme/themed";


export default function ChatBubble({ message, onChipPress }) {
  const INK = palette.textDark;
  const MUTED = palette.textMuted;
  const isUser = message.sender === "user";

  return (
    <View style={[styles.wrapper, isUser ? styles.userWrapper : styles.botWrapper]}>
      <View style={styles.max}>
        <View style={[styles.bubble, isUser ? styles.userBubble : styles.botBubble]}>
          {message.imageUri ? (
            <Image source={{ uri: message.imageUri }} style={styles.imagePreview} />
          ) : null}

          {message.text ? (
            <MarkdownText
              text={message.text}
              style={inter(15, "500", isUser ? palette.cream : INK, { lineHeight: 21 })}
              boldStyle={{ fontFamily: "Inter_700Bold" }}
            />
          ) : null}

          {message.diagnosis ? (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <MaterialCommunityIcons name="leaf" size={16} color={palette.accent} />
                <Text style={[inter(13, "700", palette.accent), styles.ml6]}>AI Vision Analysis</Text>
              </View>

              <Text style={[inter(13, "700", palette.danger), styles.issue]}>
                Problem: {message.diagnosis.issue}
              </Text>
              <Text style={inter(11, "500", MUTED)}>
                Confidence: {message.diagnosis.confidence} | Severity: {message.diagnosis.severity}
              </Text>

              <View style={styles.divider} />

              <Text style={inter(12, "700", INK)}>Treatment:</Text>
              <MarkdownText
                text={message.diagnosis.treatment}
                style={inter(12, "500", INK, { marginTop: 2, lineHeight: 18 })}
                boldStyle={{ fontFamily: "Inter_700Bold" }}
              />

              <Text style={[inter(12, "700", INK), styles.mt6]}>Recommended Fertilizer:</Text>
              <MarkdownText
                text={message.diagnosis.fertilizer}
                style={inter(12, "500", INK, { marginTop: 2, lineHeight: 18 })}
                boldStyle={{ fontFamily: "Inter_700Bold" }}
              />

              {message.diagnosis.shopItems ? (
                <View style={styles.mt6}>
                  <Text style={inter(12, "700", palette.accent)}>Shop Products:</Text>
                  {message.diagnosis.shopItems.map((item, idx) => (
                    <Text key={idx} style={[inter(11, "500", INK), styles.ml4]}>
                      {BULLET} {item}
                    </Text>
                  ))}
                </View>
              ) : null}
            </View>
          ) : null}
        </View>

        {!isUser && message.suggestedChips ? (
          <View style={styles.chipRow}>
            {message.suggestedChips.map((chip, idx) => (
              <Pressable
                key={idx}
                style={({ pressed }) => [styles.chip, pressed && { opacity: 0.7 }]}
                onPress={() => onChipPress(chip)}
              >
                <Text style={inter(12, "600", palette.accent)}>{chip}</Text>
              </Pressable>
            ))}
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = themed(() => ({
  wrapper: { marginVertical: 6 },
  userWrapper: { alignItems: "flex-end" },
  botWrapper: { alignItems: "flex-start" },
  max: { maxWidth: "85%" },
  bubble: { padding: 14, borderRadius: 16, ...shadow(2) },
  userBubble: {
    backgroundColor: palette.teal,
    borderBottomRightRadius: 4,
    borderWidth: 1.5,
    borderColor: palette.edge,
  },
  botBubble: { backgroundColor: palette.surfaceAlt, borderBottomLeftRadius: 4 },
  imagePreview: { width: 220, height: 160, borderRadius: 12, marginBottom: 8 },
  card: {
    backgroundColor: palette.surface,
    borderRadius: 12,
    padding: 10,
    marginTop: 8,
    borderWidth: 1,
    borderColor: palette.greenCardFill,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  issue: { marginVertical: 2 },
  divider: { height: 1, backgroundColor: palette.greenCardFill, marginVertical: 6 },
  chipRow: { flexDirection: "row", flexWrap: "wrap", marginTop: 8 },
  chip: {
    backgroundColor: palette.surfaceAlt,
    borderColor: palette.accent,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    marginRight: 6,
    marginBottom: 6,
  },
  ml6: { marginLeft: 6 },
  ml4: { marginLeft: 4 },
  mt6: { marginTop: 6 },
}));