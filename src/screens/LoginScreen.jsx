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
import { useAuth } from "../context/AuthContext";
import { palette, creamA } from "../theme/colors";
import { fredoka, inter } from "../theme/typography";
import { shadow } from "../theme/theme";
import { themed } from "../theme/themed";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hidePassword, setHidePassword] = useState(true);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { loginWithGoogle } = useAuth();

  const handleGoogleLogin = async () => {
    alert("Button pressed"); // TEMPORARY - remove once confirmed working
    setGoogleLoading(true);
    try {
      const result = await loginWithGoogle();
      if (result.success) {
        navigation.replace("MainTabs");
      }
      // result.success === false means cancelled or failed silently.
    } catch (err) {
      console.error("Google login failed:", err);
    } finally {
      setGoogleLoading(false);
    }
  };

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
              <Text style={[fredoka(34, "700", palette.cream), styles.title]}>Welcome Back!</Text>
              <Text style={inter(15, "600", creamA(0.92))}>Missing your buddies?</Text>
            </View>

            <AppTextField
              icon="email-outline"
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <AppTextField
              icon="lock-outline"
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={hidePassword}
              right={
                <Pressable onPress={() => setHidePassword(!hidePassword)} hitSlop={10}>
                  <MaterialCommunityIcons
                    name={hidePassword ? "eye-off-outline" : "eye-outline"}
                    size={22}
                    color={palette.textMuted}
                  />
                </Pressable>
              }
            />

            <Pressable style={styles.forgotWrap} hitSlop={8}>
              <Text style={inter(13, "700", palette.cream)}>Forgot Password?</Text>
            </Pressable>

            <AppButton label="Login" onPress={() => navigation.replace("MainTabs")} />

            <View style={styles.divider}>
              <View style={styles.line} />
              <Text style={[inter(13, "700", palette.cream), styles.or]}>OR</Text>
              <View style={styles.line} />
            </View>

            <Pressable
              style={({ pressed }) => [styles.googleButton, pressed && { opacity: 0.9 }]}
              onPress={handleGoogleLogin}
              disabled={googleLoading}
            >
              <MaterialCommunityIcons name="google" size={22} color="#DB4437" />
              <Text style={[inter(15, "700", palette.textDark), styles.googleText]}>
                {googleLoading ? "Signing in..." : "Continue with Google"}
              </Text>
            </Pressable>

            <View style={styles.footer}>
              <Text style={inter(14, "600", palette.cream)}>Don't have an account?</Text>
              <Pressable onPress={() => navigation.navigate("Register")} hitSlop={8}>
                <Text style={[inter(14, "800", palette.cream), styles.link]}>Register</Text>
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
  forgotWrap: { alignSelf: "flex-end", marginBottom: 20 },
  divider: { flexDirection: "row", alignItems: "center", marginVertical: 24 },
  line: { flex: 1, height: 1.5, backgroundColor: creamA(0.5) },
  or: { marginHorizontal: 14 },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: palette.surface,
    minHeight: 54,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: palette.edge,
    ...shadow(3),
  },
  googleText: { marginLeft: 10 },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 28,
  },
  link: { marginLeft: 6, textDecorationLine: "underline" },
}));