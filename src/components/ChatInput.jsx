import Ionicons from '@expo/vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import {
    Alert,
    Image,
    Modal,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { colors } from '../theme/colors';

export default function ChatInput({ onSendMessage }) {
  const [text, setText] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null); // { uri }

  const closeMenu = () => setMenuVisible(false);
  const handlePlusPress = () => setMenuVisible(true);

  const handleSend = () => {
    if (!text.trim() && !selectedImage) return;

    onSendMessage({
      text: text.trim(),
      imageUri: selectedImage?.uri || null,
    });

    setText('');
    setSelectedImage(null);
  };

  const openGallery = async () => {
    closeMenu();

    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission Needed', 'Gallery access is required to upload plant photos.');
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
      console.error('Gallery picker error:', error);
      Alert.alert('Error', 'Could not open the photo gallery. Please try again.');
    }
  };

  const openCamera = async () => {
    closeMenu();

    if (Platform.OS === 'web') {
      Alert.alert('Not Available', 'Camera capture is not supported in the web preview. Please choose from gallery instead.');
      return;
    }

    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission Needed', 'Camera access is required to take plant photos.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({ quality: 0.8 });

      if (!result.canceled && result.assets?.[0]?.uri) {
        setSelectedImage({ uri: result.assets[0].uri });
      }
    } catch (error) {
      console.error('Camera error:', error);
      Alert.alert('Error', 'Could not open the camera. Please try again.');
    }
  };

  const removeSelectedImage = () => setSelectedImage(null);

  return (
    <View style={styles.wrapper}>
      {/* Image preview strip — Gemini/ChatGPT style, shows above input bar */}
      {selectedImage && (
        <View style={styles.previewRow}>
          <View style={styles.previewThumbWrap}>
            <Image source={{ uri: selectedImage.uri }} style={styles.previewThumb} />
            <TouchableOpacity style={styles.removeBadge} onPress={removeSelectedImage}>
              <Ionicons name="close" size={14} color={colors.white} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={styles.container}>
        <TouchableOpacity style={styles.plusButton} onPress={handlePlusPress}>
          <Ionicons name="add" size={24} color={colors.primaryGreen} />
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder={selectedImage ? 'Add a caption (optional)...' : 'Ask anything...'}
          placeholderTextColor={colors.textMuted}
          value={text}
          onChangeText={setText}
          onSubmitEditing={handleSend}
          returnKeyType="send"
        />

        <TouchableOpacity
          style={[
            styles.sendButton,
            !text.trim() && !selectedImage && styles.sendDisabled,
          ]}
          onPress={handleSend}
          disabled={!text.trim() && !selectedImage}
        >
          <Ionicons name="send" size={16} color={colors.white} />
        </TouchableOpacity>
      </View>

      {/* Action menu for + button */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={closeMenu}
      >
        <Pressable style={styles.backdrop} onPress={closeMenu}>
          <Pressable style={styles.menuCard} onPress={(e) => e.stopPropagation?.()}>
            <Text style={styles.menuTitle}>Upload Plant Photo</Text>
            <Text style={styles.menuSubtitle}>
              Let PlantBot identify your plant or leaf problem
            </Text>

            {Platform.OS !== 'web' && (
              <TouchableOpacity style={styles.menuOption} onPress={openCamera}>
                <Ionicons name="camera-outline" size={20} color={colors.primaryGreen} />
                <Text style={styles.menuOptionText}>Take Photo</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.menuOption} onPress={openGallery}>
              <Ionicons name="images-outline" size={20} color={colors.primaryGreen} />
              <Text style={styles.menuOptionText}>Choose from Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuCancel} onPress={closeMenu}>
              <Text style={styles.menuCancelText}>Cancel</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.white,
  },
  previewRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingTop: 10,
  },
  previewThumbWrap: {
    position: 'relative',
    marginRight: 8,
  },
  previewThumb: {
    width: 64,
    height: 64,
    borderRadius: 10,
    backgroundColor: '#EEE',
  },
  removeBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#00000099',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  plusButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.bgLightGreen,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    fontSize: 15,
    color: colors.textDark,
  },
  sendButton: {
    width: 44,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primaryGreen,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  sendDisabled: {
    backgroundColor: '#A0C4AB',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  menuCard: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 30,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 4,
  },
  menuSubtitle: {
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: 16,
  },
  menuOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  menuOptionText: {
    fontSize: 15,
    color: colors.textDark,
    marginLeft: 12,
    fontWeight: '500',
  },
  menuCancel: {
    marginTop: 8,
    paddingVertical: 14,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  menuCancelText: {
    fontSize: 15,
    color: '#E53935',
    fontWeight: '600',
  },
});