// ===============================
// src/screens/RegisterScreen.jsx
// ===============================

import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function RegisterScreen({ navigation }) {
  const [hide, setHide] = useState(true);

  return (
    <LinearGradient
      colors={["#FFF7E7", "#E8FFD8", "#FFF8EC"]}
      style={styles.container}
    >
      <SafeAreaView style={styles.content}>
        <MaterialCommunityIcons
          name="sprout"
          size={70}
          color="#2E7D32"
        />

        <Text style={styles.title}>Create Account</Text>

        <View style={styles.input}>
          <MaterialCommunityIcons
            name="account-outline"
            size={22}
            color="#2E7D32"
          />
          <TextInput
            placeholder="Full Name"
            style={styles.textInput}
          />
        </View>

        <View style={styles.input}>
          <MaterialCommunityIcons
            name="email-outline"
            size={22}
            color="#2E7D32"
          />
          <TextInput
            placeholder="Email"
            style={styles.textInput}
          />
        </View>

        <View style={styles.input}>
          <MaterialCommunityIcons
            name="lock-outline"
            size={22}
            color="#2E7D32"
          />

          <TextInput
            placeholder="Password"
            secureTextEntry={hide}
            style={styles.textInput}
          />

          <TouchableOpacity
            onPress={() => setHide(!hide)}
          >
            <MaterialCommunityIcons
              name={hide ? "eye-off" : "eye"}
              size={22}
              color="#777"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.replace("MainTabs")}
        >
          <Text style={styles.buttonText}>
            Create Account
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container:{flex:1},
  content:{
    flex:1,
    justifyContent:"center",
    padding:25
  },
  title:{
    fontSize:30,
    fontWeight:"bold",
    color:"#2E7D32",
    marginVertical:25
  },
  input:{
    backgroundColor:"#fff",
    flexDirection:"row",
    alignItems:"center",
    borderRadius:15,
    paddingHorizontal:15,
    marginBottom:15,
    height:58
  },
  textInput:{
    flex:1,
    marginLeft:10
  },
  button:{
    backgroundColor:"#2E7D32",
    borderRadius:15,
    padding:18,
    alignItems:"center",
    marginTop:15
  },
  buttonText:{
    color:"#fff",
    fontWeight:"bold",
    fontSize:18
  }
});