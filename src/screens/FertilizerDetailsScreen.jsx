import React from "react";
import { Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import GradientBackground from "../components/GradientBackground";
import BackButton from "../components/BackButton";
import SectionTitle from "../components/SectionTitle";
import { fertilizerSafetyTips } from "../data/fertilizers";
import { palette, tealA } from "../theme/colors";
import { fredoka, inter } from "../theme/typography";
import { themed } from "../theme/themed";

function Block({ children, warn }) {
  return <View style={[styles.block, warn && styles.warn]}>{children}</View>;
}

function Line({ icon, color, text }) {
  return (
    <View style={styles.line}>
      <MaterialCommunityIcons name={icon} size={18} color={color} style={styles.lineIcon} />
      <Text style={[inter(14, "500", palette.textDark, { lineHeight: 21 }), styles.flex]}>{text}</Text>
    </View>
  );
}

export default function FertilizerDetailsScreen({ route }) {
  const { fertilizer } = route.params;

  return (
    <GradientBackground>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        <View>
          <Image source={{ uri: fertilizer.image }} style={styles.hero} />
          <SafeAreaView edges={["top"]} style={styles.headerOverlay}>
            <BackButton />
          </SafeAreaView>
        </View>

        <View style={styles.sheet}>
          <Text style={fredoka(28, "700", palette.ink)}>{fertilizer.name}</Text>

          <View style={[styles.row, styles.mt8]}>
            <MaterialCommunityIcons name="target" size={16} color={palette.accent} />
            <Text style={[inter(14, "700", palette.accent), styles.ml6]}>{fertilizer.purpose}</Text>
          </View>

          <View style={styles.tag}>
            <MaterialCommunityIcons name="molecule" size={14} color={palette.accent} />
            <Text style={[inter(12, "800", palette.accent), styles.ml6]}>{fertilizer.nutrient}</Text>
          </View>

          <SectionTitle title="Ingredients" onCard />
          <Block>
            {fertilizer.ingredients.map((ingredient) => (
              <Line key={ingredient} icon="circle-medium" color="#43A047" text={ingredient} />
            ))}
          </Block>

          <SectionTitle title="Preparation" onCard />
          <Block>
            {fertilizer.preparation.map((step, index) => (
              <View key={step} style={styles.step}>
                <View style={styles.stepNum}>
                  <Text style={inter(12, "800", palette.cream)}>{index + 1}</Text>
                </View>
                <Text style={[inter(14, "500", palette.textDark, { lineHeight: 21 }), styles.flex]}>
                  {step}
                </Text>
              </View>
            ))}
          </Block>

          <SectionTitle title="Application" onCard />
          <Block>
            <Line icon="watering-can-outline" color={palette.waterBlue} text={fertilizer.application} />
          </Block>

          <SectionTitle title="Benefits" onCard />
          <Block>
            {fertilizer.benefits.map((benefit) => (
              <Line key={benefit} icon="check-circle" color="#43A047" text={benefit} />
            ))}
          </Block>

          <SectionTitle title="Safety Tips" onCard />
          <Block warn>
            {fertilizerSafetyTips.map((tip) => (
              <Line key={tip} icon="alert-outline" color="#FB8C00" text={tip} />
            ))}
          </Block>
        </View>
      </ScrollView>
    </GradientBackground>
  );
}

const styles = themed(() => ({
  flex: { flex: 1 },
  row: { flexDirection: "row", alignItems: "center" },
  mt8: { marginTop: 8 },
  ml6: { marginLeft: 6 },
  hero: { width: "100%", height: 260, backgroundColor: tealA(0.2) },
  headerOverlay: { position: "absolute", top: 0, left: 16, paddingTop: 8 },
  sheet: {
    marginTop: -28,
    backgroundColor: palette.surface,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 48,
    minHeight: 500,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: palette.greenCardFill,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginTop: 12,
  },
  block: {
    backgroundColor: palette.surfaceAlt,
    borderRadius: 18,
    padding: 14,
    paddingBottom: 4,
    borderWidth: 1,
    borderColor: palette.greenCardFill,
  },
  warn: { backgroundColor: palette.warnBg, borderColor: palette.warnBorder },
  line: { flexDirection: "row", alignItems: "flex-start", marginBottom: 10 },
  lineIcon: { marginRight: 8, marginTop: 2 },
  step: { flexDirection: "row", alignItems: "flex-start", marginBottom: 12 },
  stepNum: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: palette.teal,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
}));