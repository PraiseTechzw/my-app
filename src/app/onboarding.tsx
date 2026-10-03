import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { AppButton } from "../components/ui";
import { useHabits } from "../data/habits";
import { colors, radius } from "../theme";

const pages = [
  {
    icon: "chart-timeline-variant",
    title: "Build Better Habits",
    body: "Stay consistent, track your progress, and achieve your goals — one step at a time.",
    color: colors.mint,
  },
  {
    icon: "target",
    title: "Set Your Goals",
    body: "Whether it's reading, working out, or learning something new — we've got you covered.",
    color: "#E4F8EF",
  },
  {
    icon: "clipboard-check-outline",
    title: "Track & Grow",
    body: "See your progress, stay motivated, and build the life you want.",
    color: colors.blue,
  },
];

export default function OnboardingScreen() {
  const [step, setStep] = useState(0);
  const { setOnboardingComplete } = useHabits();
  const finish = () => {
    setOnboardingComplete();
    router.replace("/(tabs)");
  };
  const page = pages[step];
  return (
    <View style={styles.screen}>
      {step === 0 ? (
        <Image
          source={require("../../assets/images/onboarding/Focused Productivity_ Laptop and Task Board.png")}
          contentFit="contain"
          accessibilityLabel="A person building better habits with a checklist"
          style={styles.heroImage}
        />
      ) : (
        <View style={[styles.illustration, { backgroundColor: page.color }]}>
          <View style={styles.artHalo} />
          <MaterialCommunityIcons
            name={page.icon as keyof typeof MaterialCommunityIcons.glyphMap}
            size={82}
            color={colors.green}
          />
          <View style={styles.artSparkle}>
            <MaterialCommunityIcons
              name="star-four-points"
              size={26}
              color="#42CFA4"
            />
          </View>
        </View>
      )}
      <View style={styles.copy}>
        <Text style={styles.title}>{page.title}</Text>
        <Text style={styles.body}>{page.body}</Text>
      </View>
      <View style={styles.footer}>
        <View style={styles.dots}>
          {pages.map((item, index) => (
            <View
              key={item.title}
              style={[styles.dot, index === step && styles.dotActive]}
            />
          ))}
        </View>
        <AppButton
          title={step === 2 ? "Get Started" : "Next"}
          onPress={
            step === 2 ? finish : () => setStep((current) => current + 1)
          }
        />
        <Pressable onPress={finish} hitSlop={12}>
          <Text style={styles.skip}>Skip</Text>
        </Pressable>
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
    paddingTop: 38,
    paddingBottom: 18,
  },
  illustration: {
    width: "100%",
    maxWidth: 300,
    height: 228,
    borderRadius: radius.large,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  heroImage: { width: "100%", maxWidth: 340, height: 300 },
  artHalo: {
    width: 146,
    height: 146,
    borderRadius: 73,
    position: "absolute",
    backgroundColor: "#FFFFFFAA",
  },
  artSparkle: { position: "absolute", top: 33, right: 42 },
  copy: { alignItems: "center", gap: 10, minHeight: 84, maxWidth: 300 },
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
  dots: {
    flexDirection: "row",
    gap: 7,
    justifyContent: "center",
    marginBottom: 5,
  },
  dot: { width: 6, height: 6, borderRadius: 4, backgroundColor: "#D4DEDF" },
  dotActive: { width: 18, backgroundColor: colors.green },
  skip: {
    color: colors.green,
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center",
    paddingVertical: 5,
  },
});
