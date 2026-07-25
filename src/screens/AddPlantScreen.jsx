import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function AddPlantScreen({ navigation }) {
  const [nickname, setNickname] = useState("");
  const [species, setSpecies] = useState("");
  const [location, setLocation] = useState("");
  const [sunlight, setSunlight] = useState("");
  const [watering, setWatering] = useState("");

  const handleSave = () => {
    if (!nickname || !species) {
      Alert.alert(
        "Missing Information",
        "Please enter at least the plant nickname and species."
      );
      return;
    }

    // Later this will save to Context or Firebase

    Alert.alert(
      "Plant Added 🌱",
      `${nickname} has been added to your collection!`,
      [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  return (
    <LinearGradient
      colors={["#FFF7E7", "#E8FFD8", "#FFF8EC"]}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}

          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
            >
              <MaterialCommunityIcons
                name="arrow-left"
                size={28}
                color="#2E7D32"
              />
            </TouchableOpacity>

            <Text style={styles.title}>
              Add Plant
            </Text>

            <View style={{ width: 28 }} />
          </View>

          {/* Photo Placeholder */}

          <TouchableOpacity style={styles.photoCard}>
            <MaterialCommunityIcons
              name="camera-plus"
              size={60}
              color="#2E7D32"
            />

            <Text style={styles.photoText}>
              Add Plant Photo
            </Text>
          </TouchableOpacity>

          {/* Nickname */}

          <Text style={styles.label}>Nickname</Text>

          <TextInput
            placeholder="Bella"
            style={styles.input}
            value={nickname}
            onChangeText={setNickname}
          />

          {/* Species */}

          <Text style={styles.label}>
            Plant Species
          </Text>

          <TextInput
            placeholder="Monstera Deliciosa"
            style={styles.input}
            value={species}
            onChangeText={setSpecies}
          />

          {/* Location */}

          <Text style={styles.label}>
            Location
          </Text>

          <TextInput
            placeholder="Living Room"
            style={styles.input}
            value={location}
            onChangeText={setLocation}
          />

          {/* Sunlight */}

          <Text style={styles.label}>
            Sunlight
          </Text>

          <TextInput
            placeholder="Medium"
            style={styles.input}
            value={sunlight}
            onChangeText={setSunlight}
          />

          {/* Watering */}

          <Text style={styles.label}>
            Watering Schedule
          </Text>

          <TextInput
            placeholder="Every 3 Days"
            style={styles.input}
            value={watering}
            onChangeText={setWatering}
          />

          {/* AI Button */}

          <TouchableOpacity
            style={styles.aiButton}
            onPress={() =>
              navigation.navigate("ScanPlant")
            }
          >
            <MaterialCommunityIcons
              name="robot"
              size={22}
              color="#2E7D32"
            />

            <Text style={styles.aiText}>
              Auto Fill Using AI Scan
            </Text>
          </TouchableOpacity>

          {/* Save */}

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
          >
            <MaterialCommunityIcons
              name="content-save"
              size={22}
              color="white"
            />

            <Text style={styles.saveText}>
              Save Plant
            </Text>
          </TouchableOpacity>

        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container:{
    padding:20,
    paddingBottom:40,
  },

  header:{
    flexDirection:"row",
    justifyContent:"space-between",
    alignItems:"center",
    marginBottom:25,
  },

  title:{
    fontSize:28,
    fontWeight:"bold",
    color:"#2E7D32",
  },

  photoCard:{
    height:200,
    backgroundColor:"white",
    borderRadius:25,
    justifyContent:"center",
    alignItems:"center",
    marginBottom:25,
  },

  photoText:{
    marginTop:15,
    fontWeight:"bold",
    color:"#2E7D32",
    fontSize:17,
  },

  label:{
    marginBottom:8,
    fontWeight:"bold",
    color:"#2E7D32",
    fontSize:16,
  },

  input:{
    backgroundColor:"white",
    borderRadius:15,
    padding:15,
    marginBottom:18,
    fontSize:16,
  },

  aiButton:{
    flexDirection:"row",
    justifyContent:"center",
    alignItems:"center",
    borderWidth:2,
    borderColor:"#2E7D32",
    borderRadius:18,
    padding:16,
    marginTop:10,
  },

  aiText:{
    marginLeft:10,
    color:"#2E7D32",
    fontWeight:"bold",
    fontSize:16,
  },

  saveButton:{
    marginTop:20,
    backgroundColor:"#2E7D32",
    borderRadius:18,
    padding:18,
    flexDirection:"row",
    justifyContent:"center",
    alignItems:"center",
  },

  saveText:{
    marginLeft:10,
    color:"white",
    fontWeight:"bold",
    fontSize:18,
  },
});