import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";
import {
  AppButton,
  Card,
  Heading,
  IconButton,
  Page,
  ProgressRing,
  SectionTitle,
} from "../../components/ui";
import { dateKey, useHabits } from "../../data/habits";
import { colors } from "../../theme";

export default function HabitDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, getCount, logHabit } = useHabits();
  const habit = data.habits.find((item) => item.id === id);
  if (!habit)
    return (
      <Page>
        <Heading title="Habit not found" />
        <AppButton
          title="Back to Home"
          onPress={() => router.replace("/(tabs)")}
        />
      </Page>
    );
  const count = getCount(habit.id);
  const week = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - 6 + index);
    const amount = getCount(habit.id, dateKey(date));
    return {
      label: date.toLocaleDateString("en", { weekday: "narrow" }),
      done: amount >= habit.target,
      today: index === 6,
    };
  });
  const log = () => {
    logHabit(habit.id, habit.target === 1 ? 1 : 1);
    router.push({ pathname: "/success", params: { habitId: habit.id } });
  };
  return (
    <Page>
      <Heading
        title="Habit Detail"
        right={<IconButton name="arrow-left" onPress={() => router.back()} />}
      />
      <View style={{ alignItems: "center", gap: 12, paddingVertical: 12 }}>
        <View
          style={{
            width: 58,
            height: 58,
            borderRadius: 20,
            backgroundColor: habit.color,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <MaterialCommunityIcons
            name={habit.icon as keyof typeof MaterialCommunityIcons.glyphMap}
            size={28}
            color={colors.greenDark}
          />
        </View>
        <Text
          style={{
            color: colors.ink,
            fontWeight: "800",
            fontSize: 19,
            textAlign: "center",
          }}
        >
          {habit.name}
        </Text>
        <Text style={{ color: colors.muted, fontSize: 11 }}>
          {habit.frequency} · Goal: {habit.target} {habit.unit}
        </Text>
        <ProgressRing
          value={count}
          total={habit.target}
          size={132}
          label={habit.unit}
        />
      </View>
      <AppButton
        title={
          habit.target > 1
            ? `Log ${habit.unit === "glasses" ? "Water" : "Progress"}`
            : count >= habit.target
              ? "Mark as Not Done"
              : "Log Habit"
        }
        onPress={log}
      />
      <SectionTitle title="This Week" />
      <Card
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingVertical: 20,
        }}
      >
        {week.map((item, index) => (
          <View
            key={`${item.label}-${index}`}
            style={{ alignItems: "center", gap: 9 }}
          >
            <View
              style={{
                width: 25,
                height: 42,
                borderRadius: 13,
                backgroundColor: item.done ? colors.green : "#EEF2F2",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {item.done ? (
                <MaterialCommunityIcons
                  name="check"
                  size={15}
                  color={colors.white}
                />
              ) : null}
            </View>
            <Text
              style={{
                color: item.today ? colors.green : colors.muted,
                fontSize: 10,
                fontWeight: item.today ? "800" : "500",
              }}
            >
              {item.label}
            </Text>
          </View>
        ))}
      </Card>
      <Card>
        <Text style={{ color: colors.ink, fontSize: 12, fontWeight: "700" }}>
          A steady rhythm
        </Text>
        <Text
          style={{
            color: colors.muted,
            fontSize: 11,
            lineHeight: 17,
            marginTop: 5,
          }}
        >
          Every check-in is progress. Keep showing up for yourself, one day at a
          time.
        </Text>
      </Card>
    </Page>
  );
}
