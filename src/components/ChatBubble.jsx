import Ionicons from '@expo/vector-icons/Ionicons';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../theme/colors';
import MarkdownText from './MarkdownText';

export default function ChatBubble({ message, onChipPress }) {
  const isUser = message.sender === 'user';

  return (
    <View style={[styles.wrapper, isUser ? styles.userWrapper : styles.botWrapper]}>
      <View style={{ maxWidth: '85%' }}>
        <View style={[styles.bubble, isUser ? styles.userBubble : styles.botBubble]}>
          {message.imageUri && (
            <Image source={{ uri: message.imageUri }} style={styles.imagePreview} />
          )}

          {message.text ? (
            <MarkdownText
              text={message.text}
              style={[styles.text, isUser ? styles.userText : styles.botText]}
            />
          ) : null}

          {message.diagnosis && (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Ionicons name="leaf" size={16} color={colors.primaryGreen} />
                <Text style={styles.cardTitle}>AI Vision Analysis</Text>
              </View>

              <Text style={styles.issue}>Problem: {message.diagnosis.issue}</Text>
              <Text style={styles.meta}>
                Confidence: {message.diagnosis.confidence} | Severity: {message.diagnosis.severity}
              </Text>

              <View style={styles.divider} />

              <Text style={styles.sectionHeader}>Treatment:</Text>
              <MarkdownText text={message.diagnosis.treatment} style={styles.body} />

              <Text style={[styles.sectionHeader, { marginTop: 6 }]}>Recommended Fertilizer:</Text>
              <MarkdownText text={message.diagnosis.fertilizer} style={styles.body} />

              {message.diagnosis.shopItems && (
                <View style={{ marginTop: 6 }}>
                  <Text style={styles.shopTitle}>Shop Products:</Text>
                  {message.diagnosis.shopItems.map((item, idx) => (
                    <Text key={idx} style={styles.shopItem}>• {item}</Text>
                  ))}
                </View>
              )}
            </View>
          )}
        </View>

        {!isUser && message.suggestedChips && (
          <View style={styles.chipRow}>
            {message.suggestedChips.map((chip, idx) => (
              <TouchableOpacity key={idx} style={styles.chip} onPress={() => onChipPress(chip)}>
                <Text style={styles.chipText}>{chip}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginVertical: 6, paddingHorizontal: 16 },
  userWrapper: { alignItems: 'flex-end' },
  botWrapper: { alignItems: 'flex-start' },
  bubble: { padding: 14, borderRadius: 16 },
  userBubble: { backgroundColor: colors.primaryGreen },
  botBubble: { backgroundColor: colors.white },
  text: { fontSize: 15, lineHeight: 21 },
  userText: { color: colors.white },
  botText: { color: colors.textDark },
  imagePreview: { width: 220, height: 160, borderRadius: 12, marginBottom: 8 },
  card: { backgroundColor: colors.cardBg, borderRadius: 12, padding: 10, marginTop: 8 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  cardTitle: { fontWeight: '700', fontSize: 13, color: colors.primaryGreen, marginLeft: 6 },
  issue: { fontWeight: '700', color: colors.accentRed, fontSize: 13, marginVertical: 2 },
  meta: { fontSize: 11, color: colors.textMuted },
  divider: { height: 1, backgroundColor: '#CBDEC0', marginVertical: 6 },
  sectionHeader: { fontWeight: '600', fontSize: 12, color: colors.textDark },
  body: { fontSize: 12, color: colors.textDark, marginTop: 2 },
  shopTitle: { fontWeight: '600', fontSize: 12, color: colors.primaryGreen },
  shopItem: { fontSize: 11, color: colors.textDark, marginLeft: 4 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 },
  chip: {
    backgroundColor: colors.white,
    borderColor: colors.primaryGreen,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    marginRight: 6,
    marginBottom: 6,
  },
  chipText: { fontSize: 12, color: colors.primaryGreen, fontWeight: '500' },
});