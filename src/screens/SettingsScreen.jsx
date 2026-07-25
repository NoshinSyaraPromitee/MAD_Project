import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Switch,
  Modal,
  Alert,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const languages = [
  { code: "en", label: "English" },
  { code: "bn", label: "বাংলা (Bangla)" },
];

export default function SettingsScreen({ navigation }) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [wateringReminders, setWateringReminders] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
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
        onPress: () =>
          navigation.reset({
            index: 0,
            routes: [{ name: "Landing" }],
          }),
      },
    ]);
  };

  const ToggleRow = ({ icon, color, title, subtitle, value, onValueChange }) => (
    <View style={styles.row}>
      <View style={[styles.iconCircle, { backgroundColor: `${color}22` }]}>
        <MaterialCommunityIcons name={icon} size={20} color={color} />
      </View>

      <View style={styles.rowText}>
        <Text style={styles.rowTitle}>{title}</Text>
        {subtitle ? <Text style={styles.rowSubtitle}>{subtitle}</Text> : null}
      </View>

      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: "#DDD", true: "#A5D6A7" }}
        thumbColor={value ? "#2E7D32" : "#FAFAFA"}
      />
    </View>
  );

  const LinkRow = ({ icon, color, title, value, onPress }) => (
    <TouchableOpacity style={styles.row} onPress={onPress}>
      <View style={[styles.iconCircle, { backgroundColor: `${color}22` }]}>
        <MaterialCommunityIcons name={icon} size={20} color={color} />
      </View>

      <View style={styles.rowText}>
        <Text style={styles.rowTitle}>{title}</Text>
      </View>

      {value ? <Text style={styles.rowValue}>{value}</Text> : null}

      <MaterialCommunityIcons name="chevron-right" size={22} color="#BBB" />
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={["#FFF7E7", "#E8FFD8", "#FFF8EC"]}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}

        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="arrow-left" size={28} color="#2E7D32" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Settings</Text>

          <View style={{ width: 28 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {/* Notifications */}

          <Text style={styles.sectionTitle}>Notifications</Text>

          <View style={styles.card}>
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
              color="#42A5F5"
              title="Watering Reminders"
              subtitle="Get notified when a plant needs water"
              value={wateringReminders}
              onValueChange={setWateringReminders}
            />
          </View>

          {/* Appearance */}

          <Text style={styles.sectionTitle}>Appearance</Text>

          <View style={styles.card}>
            <ToggleRow
              icon="theme-light-dark"
              color="#5C6BC0"
              title="Dark Mode"
              subtitle={darkMode ? "On" : "Off"}
              value={darkMode}
              onValueChange={setDarkMode}
            />
          </View>

          {/* General */}

          <Text style={styles.sectionTitle}>General</Text>

          <View style={styles.card}>
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
              color="#8D6E63"
              title="About MyPlantPal"
              onPress={() => setAboutModalVisible(true)}
            />
          </View>

          {/* Account */}

          <Text style={styles.sectionTitle}>Account</Text>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <MaterialCommunityIcons name="logout" size={20} color="#E53935" />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Language Modal */}

        <Modal
          visible={languageModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setLanguageModalVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setLanguageModalVisible(false)}
          >
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Choose Language</Text>

              {languages.map((lang) => (
                <TouchableOpacity
                  key={lang.code}
                  style={styles.modalOption}
                  onPress={() => {
                    setLanguage(lang.code);
                    setLanguageModalVisible(false);
                  }}
                >
                  <Text style={styles.modalOptionText}>{lang.label}</Text>

                  {language === lang.code && (
                    <MaterialCommunityIcons
                      name="check-circle"
                      size={20}
                      color="#2E7D32"
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>

        {/* About Modal */}

        <Modal
          visible={aboutModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setAboutModalVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setAboutModalVisible(false)}
          >
            <View style={styles.modalCard}>
              <MaterialCommunityIcons
                name="flower"
                size={40}
                color="#2E7D32"
                style={{ alignSelf: "center", marginBottom: 10 }}
              />

              <Text style={[styles.modalTitle, { textAlign: "center" }]}>
                MyPlantPal
              </Text>

              <Text style={styles.aboutText}>Version 1.0.0</Text>

              <Text style={styles.aboutText}>
                Your friendly AI gardening assistant — scan, track, and care
                for your plants with confidence.
              </Text>

              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setAboutModalVisible(false)}
              >
                <Text style={styles.modalCloseText}>Close</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2E7D32",
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#888",
    textTransform: "uppercase",
    marginBottom: 10,
    marginTop: 6,
  },

  card: {
    backgroundColor: "white",
    borderRadius: 18,
    paddingHorizontal: 16,
    marginBottom: 20,
    elevation: 3,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
  },

  divider: {
    height: 1,
    backgroundColor: "#F2F2F2",
  },

  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },

  rowText: {
    flex: 1,
    marginLeft: 14,
  },

  rowTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },

  rowSubtitle: {
    marginTop: 2,
    fontSize: 12,
    color: "#999",
  },

  rowValue: {
    color: "#999",
    marginRight: 6,
    fontSize: 13,
  },

  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 18,
    paddingVertical: 16,
    marginBottom: 20,
    elevation: 2,
  },

  logoutText: {
    marginLeft: 10,
    color: "#E53935",
    fontSize: 16,
    fontWeight: "bold",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalCard: {
    backgroundColor: "white",
    borderRadius: 22,
    padding: 24,
    width: "80%",
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 14,
  },

  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F2",
  },

  modalOptionText: {
    fontSize: 15,
    color: "#333",
  },

  aboutText: {
    color: "#666",
    fontSize: 13,
    lineHeight: 20,
    textAlign: "center",
    marginTop: 6,
  },

  modalCloseButton: {
    marginTop: 18,
    backgroundColor: "#2E7D32",
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
  },

  modalCloseText: {
    color: "white",
    fontWeight: "bold",
  },
});