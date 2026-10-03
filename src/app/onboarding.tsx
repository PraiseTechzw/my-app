import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { AppButton } from "../components/ui";
import { useHabits } from "../data/habits";
import { colors } from "../theme";

const pages = [
  {
    image: require("../../assets/images/onboarding/Focused Productivity_ Laptop and Task Board.png"),
    title: "Build Better Habits",
    body: "Stay consistent, track your progress, and achieve your goals — one step at a time.",
  },
  {
    image: require("../../assets/images/onboarding/set-goals.png"),
    title: "Set Your Goals",
    body: "Whether it’s reading, working out, or learning something new — we’ve got you covered.",
  },
  {
    image: require("../../assets/images/onboarding/track-grow.png"),
    title: "Track & Grow",
    body: "See your progress, stay motivated, and build the life you want.",
  },
];

export default function OnboardingScreen() {
  const [step, setStep] = useState(0);
  const { setOnboardingComplete } = useHabits();
  const { height } = useWindowDimensions();
  const finish = () => {
    setOnboardingComplete();
    router.replace("/(tabs)");
  };
  const page = pages[step];
  return (
    <View style={styles.screen}>
      <View style={styles.brandRow}>
        <View style={styles.brandMark}>
          <MaterialCommunityIcons name="leaf" size={24} color={colors.white} />
        </View>
        <Text style={styles.brandName}>FocusFlow</Text>
        <Text style={styles.tagline}>Small steps. Big changes.</Text>
      </View>
      <Image
        key={step}
        source={page.image}
        contentFit="contain"
        accessibilityLabel={page.title}
        transition={180}
        style={[styles.heroImage, { height: Math.min(320, Math.max(195, height * 0.39)) }]}
      />
      <View style={styles.copy}>
        <Text style={styles.title}>{page.title}</Text>
        <Text style={styles.body}>{page.body}</Text>
      </View>
      <View style={styles.footer}>
        <View style={styles.dots} accessibilityLabel={`Page ${step + 1} of 3`}>
          {pages.map((item, index) => (
            <View
              key={item.title}
              style={[styles.dot, index === step && styles.dotActive]}
            />
          ))}
        </View>
        <AppButton
          title={step === pages.length - 1 ? "Get Started" : "Next"}
          onPress={step === pages.length - 1 ? finish : () => setStep((value) => value + 1)}
        />
        {step < pages.length - 1 ? (
          <Pressable onPress={finish} hitSlop={12} accessibilityRole="button">
            <Text style={styles.skip}>Skip</Text>
          </Pressable>
        ) : <View style={styles.skipSpacer} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 26,
    paddingTop: 24,
    paddingBottom: 18,
  },
  brandRow: { alignItems: "center", gap: 4 },
  brandMark: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: colors.green,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 3,
  },
  brandName: { color: colors.ink, fontSize: 17, fontWeight: "800" },
  tagline: { color: colors.muted, fontSize: 10 },
  heroImage: { width: "100%", maxWidth: 350 },
  copy: { alignItems: "center", gap: 10, minHeight: 90, maxWidth: 310 },
  title: {
    color: colors.ink,
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
  },
  body: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 20,
    textAlign: "center",
  },
  footer: { width: "100%", maxWidth: 340, gap: 12, paddingBottom: 6 },
  dots: { flexDirection: "row", gap: 7, justifyContent: "center", marginBottom: 5 },
  dot: { width: 6, height: 6, borderRadius: 4, backgroundColor: "#D4DEDF" },
  dotActive: { width: 18, backgroundColor: colors.green },
  skip: { color: colors.green, fontSize: 12, fontWeight: "700", textAlign: "center", paddingVertical: 5 },
  skipSpacer: { height: 23 },
});
