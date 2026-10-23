import React, { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import GradientBackground from "../components/GradientBackground";
import MascotCard from "../components/MascotCard";
import AppButton from "../components/AppButton";
import { palette, creamA } from "../theme/colors";
import { inter, type } from "../theme/typography";
import { themed } from "../theme/themed";

export default function LandingScreen({ navigation }) {
  const { width, height } = useWindowDimensions();
  const float = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(float, {
          toValue: 1,
          duration: 1400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(float, {
          toValue: 0,
          duration: 1400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [float]);

  const cardSize = Math.max(200, Math.min(320, Math.min(width * 0.72, height * 0.4)));
  const translateY = float.interpolate({ inputRange: [0, 1], outputRange: [0, -10] });

  return (
    <GradientBackground>
      <SafeAreaView style={styles.flex}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={{ transform: [{ translateY }] }}>
            <MascotCard size={cardSize} />
          </Animated.View>

          <Text style={[type.hero, styles.title]} numberOfLines={1} adjustsFontSizeToFit>
            MyPlantPal
          </Text>

          <Text style={[inter(15, "700", creamA(0.92)), styles.tagline]}>
            Your Friendly AI Gardening Assistant
          </Text>

          <View style={styles.buttonWrap}>
            <AppButton
              label="Get Started"
              variant="outline"
              rightIcon="arrow-right-circle-outline"
              onPress={() => navigation.navigate("Login")}
              style={styles.button}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = themed(() => ({
  flex: { flex: 1 },
  content: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
    paddingVertical: 24,
  },
  title: {
    marginTop: 26,
    textShadowColor: "rgba(0,0,0,0.25)",
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 12,
  },
  tagline: { marginTop: 6, textAlign: "center" },
  buttonWrap: { alignSelf: "stretch", marginTop: 44, maxWidth: 460, width: "100%" },
  button: { borderColor: palette.cream, borderRadius: 22, minHeight: 56 },
}));