import React, { useMemo } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import GradientBackground from "../components/GradientBackground";
import AppCard from "../components/AppCard";
import AppButton from "../components/AppButton";
import { palette, creamA, tealA } from "../theme/colors";
import { fredoka, inter } from "../theme/typography";
import { shadow } from "../theme/theme";
import { themed } from "../theme/themed";

export default function OrderSuccessScreen({ navigation }) {
  const orderId = useMemo(() => "#" + Math.floor(Math.random() * 900000 + 100000), []);

  const goHome = () =>
    navigation.reset({ index: 0, routes: [{ name: "MainTabs" }] });

  const goShop = () =>
    navigation.reset({
      index: 0,
      routes: [{ name: "MainTabs", params: { screen: "Shop" } }],
    });

  const rows = [
    ["Order ID", orderId, palette.textDark],
    ["Estimated Delivery", "3-5 Days", palette.textDark],
    ["Status", "Processing", palette.accent],
  ];

  return (
    <GradientBackground>
      <SafeAreaView style={styles.flex}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.circle}>
            <MaterialCommunityIcons name="check-bold" size={84} color={palette.cream} />
          </View>

          <Text style={[fredoka(36, "700", palette.cream), styles.title]}>Order Confirmed!</Text>
          <Text style={[inter(15, "600", creamA(0.92)), styles.sub]}>
            Thank you for shopping with MyPlantPal.
          </Text>
          <Text style={[inter(15, "600", creamA(0.92)), styles.sub]}>
            Your order has been placed successfully.
          </Text>

          <AppCard style={styles.card} padding={22}>
            {rows.map(([label, value, color], i) => (
              <View key={label}>
                {i > 0 ? <View style={styles.divider} /> : null}
                <View style={styles.row}>
                  <Text style={inter(15, "500", palette.textMuted)}>{label}</Text>
                  <Text style={inter(15, "800", color)}>{value}</Text>
                </View>
              </View>
            ))}
          </AppCard>

          <AppButton label="Back to Home" leftIcon="home" onPress={goHome} style={styles.btn} />
          <AppButton
            label="Continue Shopping"
            leftIcon="shopping"
            variant="outline"
            onPress={goShop}
            style={styles.btn2}
          />
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = themed(() => ({
  flex: { flex: 1 },
  content: { flexGrow: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  circle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: palette.teal,
    borderWidth: 4,
    borderColor: palette.cream,
    alignItems: "center",
    justifyContent: "center",
    ...shadow(10, 0.3),
  },
  title: {
    marginTop: 28,
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.2)",
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 8,
  },
  sub: { textAlign: "center", marginTop: 6 },
  card: { alignSelf: "stretch", marginTop: 30 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  divider: { height: 1, backgroundColor: tealA(0.12), marginVertical: 14 },
  btn: { alignSelf: "stretch", marginTop: 30 },
  btn2: { alignSelf: "stretch", marginTop: 12 },
}));