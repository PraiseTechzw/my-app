import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";
import { AppButton, Page } from "../components/ui";
import { useHabits } from "../data/habits";
import { colors } from "../theme";

export default function SuccessScreen() {
  const { habitId } = useLocalSearchParams<{ habitId: string }>();
  const { data } = useHabits();
  const habit = data.habits.find((item) => item.id === habitId);
  return (
    <Page style={{ justifyContent: "center", alignItems: "center", gap: 22 }}>
      <View
        style={{
          width: 118,
          height: 118,
          borderRadius: 59,
          backgroundColor: colors.green,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <MaterialCommunityIcons name="check" size={62} color={colors.white} />
      </View>
      <View style={{ gap: 8, alignItems: "center" }}>
        <Text style={{ color: colors.ink, fontSize: 24, fontWeight: "800" }}>
          Great Job!
        </Text>
        <Text
          style={{ color: colors.muted, fontSize: 12, textAlign: "center" }}
        >
          {habit
            ? `You made progress on ${habit.name}.`
            : "You completed your habit for today."}
        </Text>
      </View>
      <View style={{ width: "100%", gap: 10, marginTop: 18 }}>
        <AppButton
          title="View Progress"
          onPress={() =>
            habitId
              ? router.replace({
                  pathname: "/habit/[id]",
                  params: { id: habitId },
                })
              : router.replace("/(tabs)/stats")
          }
        />
        <AppButton
          title="Back to Home"
          variant="outline"
          onPress={() => router.replace("/(tabs)")}
        />
      </View>
    </Page>
  );
}
