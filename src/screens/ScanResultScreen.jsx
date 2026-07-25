// ===============================
// src/screens/ScanResultScreen.jsx
// ===============================

import React from "react";
import {
SafeAreaView,
StyleSheet,
Text,
TouchableOpacity,
View
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";

export default function ScanResultScreen({navigation}){

return(

<LinearGradient
colors={["#FFF7E7","#E8FFD8","#FFF8EC"]}
style={styles.container}
>

<SafeAreaView style={styles.content}>

<Text style={styles.title}>
🌿 Plant Identified
</Text>

<View style={styles.card}>

<Text style={styles.name}>
Monstera Deliciosa
</Text>

<Text style={styles.info}>
Health Score: 95%
</Text>

<Text style={styles.info}>
Healthy Plant
</Text>

<Text style={styles.info}>
Indoor Plant
</Text>

</View>

<TouchableOpacity
style={styles.button}
onPress={()=>navigation.navigate("CareGuide")}
>

<Text style={styles.buttonText}>
View Care Guide
</Text>

</TouchableOpacity>

</SafeAreaView>

</LinearGradient>

)

}

const styles=StyleSheet.create({

container:{flex:1},

content:{
flex:1,
justifyContent:"center",
padding:25
},

title:{
fontSize:28,
fontWeight:"bold",
marginBottom:30,
color:"#2E7D32"
},

card:{
backgroundColor:"#fff",
padding:25,
borderRadius:20
},

name:{
fontSize:24,
fontWeight:"bold",
marginBottom:15
},

info:{
fontSize:17,
marginBottom:10
},

button:{
marginTop:30,
backgroundColor:"#2E7D32",
padding:18,
borderRadius:18,
alignItems:"center"
},

buttonText:{
color:"#fff",
fontWeight:"bold",
fontSize:18
}

});