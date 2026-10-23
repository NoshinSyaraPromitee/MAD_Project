// ===============================
// src/screens/RegisterScreen.jsx
// ===============================

import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import GradientBackground from "../components/GradientBackground";
import BackButton from "../components/BackButton";
import MascotCard from "../components/MascotCard";
import AppTextField from "../components/AppTextField";
import AppButton from "../components/AppButton";
import { palette, creamA } from "../theme/colors";
import { fredoka, inter } from "../theme/typography";
import { themed } from "../theme/themed";

export default function RegisterScreen({ navigation }) {
  const [hide, setHide] = useState(true);

  return (
    <GradientBackground>
      <SafeAreaView style={styles.flex}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={styles.topBar}>
            <BackButton />
          </View>

          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.header}>
              <MascotCard size={130} glow={false} leaves={false} />
              <Text style={[fredoka(34, "700", palette.cream), styles.title]}>Create Account</Text>
              <Text style={inter(15, "600", creamA(0.92))}>Join the green family</Text>
            </View>

            <AppTextField icon="account-outline" placeholder="Full Name" />

            <AppTextField
              icon="email-outline"
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <AppTextField
              icon="lock-outline"
              placeholder="Password"
              secureTextEntry={hide}
              right={
                <Pressable onPress={() => setHide(!hide)} hitSlop={10}>
                  <MaterialCommunityIcons
                    name={hide ? "eye-off-outline" : "eye-outline"}
                    size={22}
                    color={palette.textMuted}
                  />
                </Pressable>
              }
            />

            <AppButton
              label="Create Account"
              onPress={() => navigation.replace("MainTabs")}
              style={styles.button}
            />

            <View style={styles.footer}>
              <Text style={inter(14, "600", palette.cream)}>Already have an account?</Text>
              <Pressable onPress={() => navigation.navigate("Login")} hitSlop={8}>
                <Text style={[inter(14, "800", palette.cream), styles.link]}>Login</Text>
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = themed(() => ({
  flex: { flex: 1 },
  topBar: { paddingHorizontal: 16, paddingTop: 8 },
  content: { flexGrow: 1, justifyContent: "center", paddingHorizontal: 24, paddingBottom: 32 },
  header: { alignItems: "center", marginBottom: 26 },
  title: {
    marginTop: 6,
    textShadowColor: "rgba(0,0,0,0.2)",
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 8,
  },
  button: { marginTop: 8 },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 28,
  },
  link: { marginLeft: 6, textDecorationLine: "underline" },
}));