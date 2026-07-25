import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hidePassword, setHidePassword] = useState(true);

  return (
    <LinearGradient
      colors={["#FFF3D6", "#ECFFD8", "#FFF6E5"]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>

        <View style={styles.header}>
          <MaterialCommunityIcons
            name="flower"
            size={70}
            color="#2E7D32"
          />

          <Text style={styles.title}>Welcome Back!</Text>

          <Text style={styles.subtitle}>
            Continue your plant journey 🌱
          </Text>
        </View>

        {/* Email */}

        <View style={styles.inputContainer}>
          <MaterialCommunityIcons
            name="email-outline"
            size={22}
            color="#2E7D32"
          />

          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
          />
        </View>

        {/* Password */}

        <View style={styles.inputContainer}>
          <MaterialCommunityIcons
            name="lock-outline"
            size={22}
            color="#2E7D32"
          />

          <TextInput
            placeholder="Password"
            value={password}
            secureTextEntry={hidePassword}
            onChangeText={setPassword}
            style={styles.input}
          />

          <TouchableOpacity
            onPress={() => setHidePassword(!hidePassword)}
          >
            <MaterialCommunityIcons
              name={
                hidePassword
                  ? "eye-off-outline"
                  : "eye-outline"
              }
              size={22}
              color="#777"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity>
          <Text style={styles.forgot}>
            Forgot Password?
          </Text>
        </TouchableOpacity>

        {/* Login */}

        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.replace("MainTabs")}
        >
          <Text style={styles.loginText}>
            Login
          </Text>
        </TouchableOpacity>

        {/* Divider */}

        <View style={styles.divider}>
          <View style={styles.line} />

          <Text style={styles.or}>OR</Text>

          <View style={styles.line} />
        </View>

        {/* Google */}

        <TouchableOpacity style={styles.googleButton}>
          <MaterialCommunityIcons
            name="google"
            size={22}
            color="#DB4437"
          />

          <Text style={styles.googleText}>
            Continue with Google
          </Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text>
            Don't have an account?
          </Text>

          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Register")
            }
          >
            <Text style={styles.register}>
              Register
            </Text>
          </TouchableOpacity>
        </View>

      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  safeArea: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 25,
  },

  header: {
    alignItems: "center",
    marginBottom: 40,
  },

  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#2E7D32",
    marginTop: 15,
  },

  subtitle: {
    marginTop: 8,
    color: "#666",
    fontSize: 16,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",

    backgroundColor: "#fff",

    borderRadius: 15,

    paddingHorizontal: 15,

    marginBottom: 15,

    height: 58,

    elevation: 4,
  },

  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },

  forgot: {
    alignSelf: "flex-end",
    color: "#2E7D32",
    marginBottom: 30,
    fontWeight: "600",
  },

  loginButton: {
    backgroundColor: "#2E7D32",
    height: 58,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },

  loginText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 18,
  },

  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 30,
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#bbb",
  },

  or: {
    marginHorizontal: 15,
    color: "#888",
  },

  googleButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",

    backgroundColor: "#fff",

    height: 56,

    borderRadius: 15,

    elevation: 3,
  },

  googleText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "600",
  },

  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 35,
  },

  register: {
    marginLeft: 5,
    color: "#2E7D32",
    fontWeight: "700",
  },
});