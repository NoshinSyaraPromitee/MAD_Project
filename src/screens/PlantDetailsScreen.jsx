import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import HealthBadge from "../components/HealthBadge";

export default function PlantDetailsScreen({
  route,
  navigation,
}) {
  const { plant } = route.params;

  return (
    <LinearGradient
      colors={["#FFF7E7", "#E8FFD8", "#FFF8EC"]}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}

          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <MaterialCommunityIcons
                name="arrow-left"
                size={28}
                color="#2E7D32"
              />
            </TouchableOpacity>

            <TouchableOpacity>
              <MaterialCommunityIcons
                name="pencil-outline"
                size={26}
                color="#2E7D32"
              />
            </TouchableOpacity>
          </View>

          {/* Plant Image */}

          <Image
            source={{ uri: plant.image }}
            style={styles.image}
          />

          <View style={styles.content}>

            <Text style={styles.nickname}>
              {plant.nickname}
            </Text>

            <Text style={styles.species}>
              {plant.species}
            </Text>

            <HealthBadge health={plant.health} />

            {/* Information */}

            <View style={styles.infoContainer}>

              <View style={styles.infoCard}>
                <MaterialCommunityIcons
                  name="water"
                  size={28}
                  color="#42A5F5"
                />

                <Text style={styles.infoTitle}>
                  Water
                </Text>

                <Text style={styles.infoValue}>
                  {plant.waterLevel}
                </Text>
              </View>

              <View style={styles.infoCard}>
                <MaterialCommunityIcons
                  name="white-balance-sunny"
                  size={28}
                  color="#FFB300"
                />

                <Text style={styles.infoTitle}>
                  Sunlight
                </Text>

                <Text style={styles.infoValue}>
                  {plant.sunlight}
                </Text>
              </View>

            </View>

            <View style={styles.infoContainer}>

              <View style={styles.infoCard}>
                <MaterialCommunityIcons
                  name="map-marker"
                  size={28}
                  color="#43A047"
                />

                <Text style={styles.infoTitle}>
                  Location
                </Text>

                <Text style={styles.infoValue}>
                  {plant.location}
                </Text>
              </View>

              <View style={styles.infoCard}>
                <MaterialCommunityIcons
                  name="water-percent"
                  size={28}
                  color="#00ACC1"
                />

                <Text style={styles.infoTitle}>
                  Humidity
                </Text>

                <Text style={styles.infoValue}>
                  {plant.humidity}
                </Text>
              </View>

            </View>

            {/* Care Timeline */}

            <Text style={styles.section}>
              Today's Care
            </Text>

            <View style={styles.taskCard}>
              <MaterialCommunityIcons
                name="check-circle"
                size={26}
                color="#4CAF50"
              />

              <Text style={styles.taskText}>
                Water Plant Tomorrow
              </Text>
            </View>

            <View style={styles.taskCard}>
              <MaterialCommunityIcons
                name="flower"
                size={26}
                color="#FB8C00"
              />

              <Text style={styles.taskText}>
                Fertilize {plant.fertilizer}
              </Text>
            </View>

            <View style={styles.taskCard}>
              <MaterialCommunityIcons
                name="camera-outline"
                size={26}
                color="#5C6BC0"
              />

              <Text style={styles.taskText}>
                Last Scan: {plant.lastScan}
              </Text>
            </View>

            {/* Buttons */}

            <TouchableOpacity
              style={styles.scanButton}
              onPress={() => navigation.navigate("ScanPlant")}
            >
              <MaterialCommunityIcons
                name="camera"
                size={24}
                color="white"
              />

              <Text style={styles.scanText}>
                Scan Again
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.aiButton}
              onPress={() => navigation.navigate("AIChat")}
            >
              <MaterialCommunityIcons
                name="robot"
                size={24}
                color="#2E7D32"
              />

              <Text style={styles.aiText}>
                Ask AI Doctor
              </Text>
            </TouchableOpacity>

          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header:{
    flexDirection:"row",
    justifyContent:"space-between",
    padding:20,
  },

  image:{
    width:"100%",
    height:320,
    resizeMode:"cover",
  },

  content:{
    backgroundColor:"white",
    marginTop:-25,
    borderTopLeftRadius:30,
    borderTopRightRadius:30,
    padding:25,
  },

  nickname:{
    fontSize:30,
    fontWeight:"bold",
    color:"#2E7D32",
  },

  species:{
    color:"#777",
    marginBottom:15,
    fontSize:16,
  },

  infoContainer:{
    flexDirection:"row",
    justifyContent:"space-between",
    marginTop:20,
  },

  infoCard:{
    width:"48%",
    backgroundColor:"#F8F8F8",
    borderRadius:20,
    alignItems:"center",
    padding:18,
  },

  infoTitle:{
    marginTop:10,
    color:"#666",
    fontWeight:"600",
  },

  infoValue:{
    marginTop:5,
    fontWeight:"bold",
    fontSize:16,
    color:"#2E7D32",
  },

  section:{
    marginTop:30,
    marginBottom:15,
    fontWeight:"bold",
    fontSize:22,
    color:"#2E7D32",
  },

  taskCard:{
    flexDirection:"row",
    alignItems:"center",
    backgroundColor:"#F8F8F8",
    padding:18,
    borderRadius:18,
    marginBottom:15,
  },

  taskText:{
    marginLeft:15,
    fontSize:16,
    fontWeight:"600",
  },

  scanButton:{
    marginTop:20,
    backgroundColor:"#2E7D32",
    padding:18,
    borderRadius:18,
    flexDirection:"row",
    justifyContent:"center",
    alignItems:"center",
  },

  scanText:{
    color:"white",
    fontSize:18,
    fontWeight:"bold",
    marginLeft:10,
  },

  aiButton:{
    marginTop:15,
    borderWidth:2,
    borderColor:"#2E7D32",
    padding:18,
    borderRadius:18,
    flexDirection:"row",
    justifyContent:"center",
    alignItems:"center",
    marginBottom:30,
    backgroundColor:"white",
  },

  aiText:{
    color:"#2E7D32",
    fontWeight:"bold",
    fontSize:18,
    marginLeft:10,
  },
});