import React, { useEffect, useRef } from "react";
import { Animated, Easing, Text, View, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import GradientBackground from "../components/GradientBackground";
import RiveMascot from "../components/RiveMascot";
import { useAuth } from "../context/AuthContext";
import { palette, creamA } from "../theme/colors";
import { inter, type } from "../theme/typography";
import { themed } from "../theme/themed";

export default function SplashScreen({ navigation }) {
  const { width, height } = useWindowDimensions();
  const { user, isLoading } = useAuth();

  const fade = useRef(new Animated.Value(0)).current;
  const bar = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 600, useNativeDriver: true }).start();
    Animated.loop(
      Animated.timing(bar, {
        toValue: 1,
        duration: 1200,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      })
    ).start();
  }, [fade, bar]);

  useEffect(() => {
    if (isLoading) return undefined;
    const timer = setTimeout(() => {
      navigation.replace(user ? "MainTabs" : "Landing");
    }, 2200);
    return () => clearTimeout(timer);
  }, [isLoading, user, navigation]);

  const trackW = width * 0.42;
  const translateX = bar.interpolate({
    inputRange: [0, 1],
    outputRange: [-trackW * 0.4, trackW],
  });

  return (
    <GradientBackground>
      <SafeAreaView style={styles.flex}>
        <Animated.View style={[styles.flex, styles.center, { opacity: fade }]}>
          <View style={{ height: height * 0.05 }} />
          <Text style={[type.hero, styles.title]} numberOfLines={1} adjustsFontSizeToFit>
            MyPlantPal
          </Text>
          <Text style={[inter(14, "700", palette.taglineTop), styles.tagline]}>
            Your Friendly AI Gardening Assistant
          </Text>

          <View style={styles.flex} />
          <RiveMascot width={width * 0.5} />
          <View style={styles.flex} />

          <View style={[styles.track, { width: trackW }]}>
            <Animated.View
              style={[styles.thumb, { width: trackW * 0.4, transform: [{ translateX }] }]}
            />
          </View>
          <Text style={[inter(12, "600", palette.cream), styles.loading]}>Loading...</Text>
          <View style={{ height: height * 0.07 }} />
        </Animated.View>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = themed(() => ({
  flex: { flex: 1 },
  center: { alignItems: "center" },
  title: {
    paddingHorizontal: 24,
    textShadowColor: "rgba(0,0,0,0.25)",
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 12,
  },
  tagline: { marginTop: 8, textAlign: "center" },
  track: {
    height: 4,
    borderRadius: 4,
    overflow: "hidden",
    backgroundColor: creamA(0.35),
  },
  thumb: { height: 4, borderRadius: 4, backgroundColor: palette.cream },
  loading: { marginTop: 8 },
}));