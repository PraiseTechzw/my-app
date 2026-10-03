import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { useHabits } from "../data/habits";
import { colors } from "../theme";

export default function IndexRoute() {
  const { data, loaded } = useHabits();
  const [showSplash, setShowSplash] = useState(true);
  useEffect(() => {
    if (!loaded) return;
    const timeout = setTimeout(() => setShowSplash(false), 950);
    return () => clearTimeout(timeout);
  }, [loaded]);
  if (!loaded || showSplash)
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.white,
          gap: 10,
        }}
      >
        <View
          style={{
            width: 68,
            height: 68,
            borderRadius: 22,
            backgroundColor: colors.green,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <MaterialCommunityIcons name="leaf" size={34} color={colors.white} />
        </View>
        <Text
          style={{
            color: colors.ink,
            fontSize: 21,
            fontWeight: "800",
            marginTop: 2,
          }}
        >
          FocusFlow
        </Text>
        <Text style={{ color: colors.muted, fontSize: 11 }}>
          Small steps. Big changes.
        </Text>
      </View>
    );
  return (
    <Redirect href={data.onboardingComplete ? "/(tabs)" : "/onboarding"} />
  );
}
