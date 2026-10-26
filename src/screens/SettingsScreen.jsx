import React, { useState } from "react";
import { Alert, Modal, Pressable, Switch, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import AppScreen from "../components/AppScreen";
import AppCard from "../components/AppCard";
import AppButton from "../components/AppButton";
import SectionTitle from "../components/SectionTitle";
import RiveMascot from "../components/RiveMascot";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { palette, tealA } from "../theme/colors";
import { fredoka, inter } from "../theme/typography";
import { shadow } from "../theme/theme";
import { themed } from "../theme/themed";

const languages = [
  { code: "en", label: "English" },
  { code: "bn", label: "\u09AC\u09BE\u0982\u09B2\u09BE (Bangla)" },
];

function ToggleRow({ icon, color, title, subtitle, value, onValueChange }) {
  return (
    <View style={styles.row}>
      <View style={[styles.iconCircle, { backgroundColor: `${color}22` }]}>
        <MaterialCommunityIcons name={icon} size={20} color={color} />
      </View>
      <View style={styles.rowText}>
        <Text style={inter(15, "700", palette.textDark)}>{title}</Text>
        {subtitle ? <Text style={[inter(12, "500", palette.textMuted), styles.mt2]}>{subtitle}</Text> : null}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: palette.switchOff, true: palette.switchOn }}
        thumbColor={value ? palette.accent : "#FAFAFA"}
      />
    </View>
  );
}

function LinkRow({ icon, color, title, value, onPress }) {
  return (
    <Pressable style={({ pressed }) => [styles.row, pressed && { opacity: 0.7 }]} onPress={onPress}>
      <View style={[styles.iconCircle, { backgroundColor: `${color}22` }]}>
        <MaterialCommunityIcons name={icon} size={20} color={color} />
      </View>
      <View style={styles.rowText}>
        <Text style={inter(15, "700", palette.textDark)}>{title}</Text>
      </View>
      {value ? <Text style={[inter(13, "600", palette.textMuted), styles.mr6]}>{value}</Text> : null}
      <MaterialCommunityIcons name="chevron-right" size={22} color={palette.accent} />
    </Pressable>
  );
}

export default function SettingsScreen({ navigation }) {
  const { logout } = useAuth();
  const { isDark, setDark } = useTheme();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [wateringReminders, setWateringReminders] = useState(true);
  const [language, setLanguage] = useState("en");

  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [aboutModalVisible, setAboutModalVisible] = useState(false);

  const selectedLanguage = languages.find((l) => l.code === language);

  const handleLogout = () => {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log Out",
        style: "destructive",
        onPress: async () => {
          await logout();
          navigation.reset({ index: 0, routes: [{ name: "Landing" }] });
        },
      },
    ]);
  };

  return (
    <AppScreen title="Settings" scroll>
      <SectionTitle title="Notifications" upper />
      <AppCard padding={0} style={styles.card}>
        <ToggleRow
          icon="bell-outline"
          color="#FB8C00"
          title="Push Notifications"
          subtitle="General app updates and alerts"
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
        />
        <View style={styles.divider} />
        <ToggleRow
          icon="water-outline"
          color={palette.waterBlue}
          title="Watering Reminders"
          subtitle="Get notified when a plant needs water"
          value={wateringReminders}
          onValueChange={setWateringReminders}
        />
      </AppCard>

      <SectionTitle title="Appearance" upper />
      <AppCard padding={0} style={styles.card}>
        <ToggleRow
          icon="theme-light-dark"
          color="#5C6BC0"
          title="Dark Mode"
          subtitle={isDark ? "On" : "Off"}
          value={isDark}
          onValueChange={setDark}
        />
      </AppCard>

      <SectionTitle title="General" upper />
      <AppCard padding={0} style={styles.card}>
        <LinkRow
          icon="translate"
          color="#43A047"
          title="Language"
          value={selectedLanguage.label}
          onPress={() => setLanguageModalVisible(true)}
        />
        <View style={styles.divider} />
        <LinkRow
          icon="information-outline"
          color={palette.brown}
          title="About MyPlantPal"
          onPress={() => setAboutModalVisible(true)}
        />
      </AppCard>

      <SectionTitle title="Account" upper />
      <AppButton label="Log Out" leftIcon="logout" variant="danger" onPress={handleLogout} />

      {/* Language modal */}
      <Modal
        visible={languageModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setLanguageModalVisible(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setLanguageModalVisible(false)}>
          <View style={styles.modalCard}>
            <Text style={[fredoka(22, "700", palette.ink), styles.mb12]}>Choose Language</Text>
            {languages.map((lang) => (
              <Pressable
                key={lang.code}
                style={styles.option}
                onPress={() => {
                  setLanguage(lang.code);
                  setLanguageModalVisible(false);
                }}
              >
                <Text style={inter(15, "600", palette.textDark)}>{lang.label}</Text>
                {language === lang.code ? (
                  <MaterialCommunityIcons name="check-circle" size={22} color={palette.accent} />
                ) : null}
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>

      {/* About modal */}
      <Modal
        visible={aboutModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setAboutModalVisible(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setAboutModalVisible(false)}>
          <View style={[styles.modalCard, styles.center]}>
            <RiveMascot width={110} />
            <Text style={[fredoka(26, "700", palette.ink), styles.mt8]}>MyPlantPal</Text>
            <Text style={[inter(13, "600", palette.textMuted), styles.mt4]}>Version 1.0.0</Text>
            <Text style={[inter(13, "500", palette.textDark, { lineHeight: 20 }), styles.about]}>
              Your friendly AI gardening assistant - scan, track, and care for your plants with
              confidence.
            </Text>
            <AppButton
              label="Close"
              onPress={() => setAboutModalVisible(false)}
              style={styles.closeBtn}
            />
          </View>
        </Pressable>
      </Modal>
    </AppScreen>
  );
}

const styles = themed(() => ({
  card: { paddingHorizontal: 16 },
  row: { flexDirection: "row", alignItems: "center", paddingVertical: 14 },
  rowText: { flex: 1, marginLeft: 14 },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  divider: { height: 1, backgroundColor: tealA(0.1) },
  mt2: { marginTop: 2 },
  mt4: { marginTop: 4 },
  mt8: { marginTop: 8 },
  mb12: { marginBottom: 12 },
  mr6: { marginRight: 6 },
  center: { alignItems: "center" },
  overlay: {
    flex: 1,
    backgroundColor: palette.overlay,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  modalCard: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: palette.surface,
    borderRadius: 26,
    padding: 24,
    ...shadow(12),
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: tealA(0.1),
  },
  about: { textAlign: "center", marginTop: 10 },
  closeBtn: { alignSelf: "stretch", marginTop: 18 },
}));