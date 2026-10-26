import React, { useState } from "react";
import {
  Alert,
  Image,
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

import { palette, tealA } from "../theme/colors";
import { inter } from "../theme/typography";
import { themed } from "../theme/themed";

export default function ChatInput({ onSendMessage }) {
  const [text, setText] = useState("");
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null); // { uri }

  const closeMenu = () => setMenuVisible(false);
  const canSend = !!text.trim() || !!selectedImage;

  const handleSend = () => {
    if (!canSend) return;
    onSendMessage({
      text: text.trim(),
      imageUri: selectedImage?.uri || null,
    });
    setText("");
    setSelectedImage(null);
  };

  const openGallery = async () => {
    closeMenu();
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Permission Needed", "Gallery access is required to upload plant photos.");
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
      });
      if (!result.canceled && result.assets?.[0]?.uri) {
        setSelectedImage({ uri: result.assets[0].uri });
      }
    } catch (error) {
      console.error("Gallery picker error:", error);
      Alert.alert("Error", "Could not open the photo gallery. Please try again.");
    }
  };

  const openCamera = async () => {
    closeMenu();
    if (Platform.OS === "web") {
      Alert.alert(
        "Not Available",
        "Camera capture is not supported in the web preview. Please choose from gallery instead."
      );
      return;
    }
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Permission Needed", "Camera access is required to take plant photos.");
        return;
      }
      const result = await ImagePicker.launchCameraAsync({ quality: 0.8 });
      if (!result.canceled && result.assets?.[0]?.uri) {
        setSelectedImage({ uri: result.assets[0].uri });
      }
    } catch (error) {
      console.error("Camera error:", error);
      Alert.alert("Error", "Could not open the camera. Please try again.");
    }
  };

  return (
    <View style={styles.wrapper}>
      {selectedImage ? (
        <View style={styles.previewRow}>
          <View>
            <Image source={{ uri: selectedImage.uri }} style={styles.previewThumb} />
            <Pressable style={styles.removeBadge} onPress={() => setSelectedImage(null)}>
              <MaterialCommunityIcons name="close" size={14} color={palette.white} />
            </Pressable>
          </View>
        </View>
      ) : null}

      <View style={styles.container}>
        <Pressable style={styles.plusButton} onPress={() => setMenuVisible(true)}>
          <MaterialCommunityIcons name="plus" size={24} color={palette.accent} />
        </Pressable>

        <TextInput
          style={styles.input}
          placeholder={selectedImage ? "Add a caption (optional)..." : "Ask anything..."}
          placeholderTextColor={palette.textMuted}
          cursorColor={palette.accent}
          value={text}
          onChangeText={setText}
          onSubmitEditing={handleSend}
          returnKeyType="send"
        />

        <Pressable
          style={[styles.sendButton, !canSend && styles.sendDisabled]}
          onPress={handleSend}
          disabled={!canSend}
        >
          <MaterialCommunityIcons name="send" size={18} color={palette.cream} />
        </Pressable>
      </View>

      <Modal visible={menuVisible} transparent animationType="fade" onRequestClose={closeMenu}>
        <Pressable style={styles.backdrop} onPress={closeMenu}>
          <Pressable style={styles.menuCard} onPress={(e) => e.stopPropagation?.()}>
            <View style={styles.handle} />
            <Text style={inter(17, "700", palette.textDark)}>Upload Plant Photo</Text>
            <Text style={[inter(13, "500", palette.textMuted), styles.menuSubtitle]}>
              Let PlantBot identify your plant or leaf problem
            </Text>

            {Platform.OS !== "web" ? (
              <Pressable style={styles.menuOption} onPress={openCamera}>
                <MaterialCommunityIcons name="camera-outline" size={22} color={palette.accent} />
                <Text style={[inter(15, "600", palette.textDark), styles.optionText]}>Take Photo</Text>
              </Pressable>
            ) : null}

            <Pressable style={styles.menuOption} onPress={openGallery}>
              <MaterialCommunityIcons name="image-multiple-outline" size={22} color={palette.accent} />
              <Text style={[inter(15, "600", palette.textDark), styles.optionText]}>
                Choose from Gallery
              </Text>
            </Pressable>

            <Pressable style={styles.menuCancel} onPress={closeMenu}>
              <Text style={inter(15, "700", palette.danger)}>Cancel</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = themed(() => ({
  wrapper: {
    backgroundColor: palette.surface,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    borderTopWidth: 1.5,
    borderColor: palette.edge,
    paddingBottom: 4,
  },
  previewRow: { flexDirection: "row", paddingHorizontal: 14, paddingTop: 12 },
  previewThumb: { width: 64, height: 64, borderRadius: 12, backgroundColor: tealA(0.08) },
  removeBadge: {
    position: "absolute",
    top: -6,
    right: -6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  plusButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: tealA(0.1),
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 44,
    backgroundColor: palette.surfaceAlt,
    borderRadius: 22,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: palette.greenCardFill,
    ...inter(15, "500", palette.textDark),
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: palette.teal,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  sendDisabled: { opacity: 0.45 },
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" },
  menuCard: {
    backgroundColor: palette.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 22,
    paddingTop: 10,
    paddingBottom: 30,
  },
  handle: {
    alignSelf: "center",
    width: 42,
    height: 5,
    borderRadius: 3,
    backgroundColor: tealA(0.25),
    marginBottom: 14,
  },
  menuSubtitle: { marginTop: 4, marginBottom: 14 },
  menuOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: tealA(0.1),
  },
  optionText: { marginLeft: 12 },
  menuCancel: {
    marginTop: 6,
    paddingVertical: 14,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: tealA(0.1),
  },
}));