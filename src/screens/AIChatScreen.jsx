// ===============================
// src/screens/AIChatScreen.jsx
// ===============================

import React from "react";
import {
SafeAreaView,
StyleSheet,
Text,
TextInput,
TouchableOpacity,
View
} from "react-native";

import {LinearGradient} from "expo-linear-gradient";

export default function AIChatScreen(){

return(

<LinearGradient
colors={["#FFF7E7","#E8FFD8","#FFF8EC"]}
style={{flex:1}}
>

<SafeAreaView style={styles.container}>

<View style={styles.chat}>

<Text style={styles.bot}>
🌿 Hello! I'm PlantBot.
</Text>

<Text style={styles.reply}>
How can I help your plants today?
</Text>

</View>

<View style={styles.bottom}>

<TextInput
placeholder="Ask anything..."
style={styles.input}
/>

<TouchableOpacity style={styles.send}>

<Text style={{color:"#fff"}}>➤</Text>

</TouchableOpacity>

</View>

</SafeAreaView>

</LinearGradient>

)

}

const styles=StyleSheet.create({

container:{
flex:1,
justifyContent:"space-between",
padding:20
},

chat:{
backgroundColor:"#fff",
padding:20,
borderRadius:20
},

bot:{
fontWeight:"bold",
fontSize:18,
marginBottom:10
},

reply:{
fontSize:16
},

bottom:{
flexDirection:"row"
},

input:{
flex:1,
backgroundColor:"#fff",
borderRadius:15,
paddingHorizontal:15
},

send:{
marginLeft:10,
backgroundColor:"#2E7D32",
width:55,
justifyContent:"center",
alignItems:"center",
borderRadius:15
}

});