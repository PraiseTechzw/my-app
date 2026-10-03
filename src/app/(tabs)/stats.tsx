import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Text, View } from "react-native";
import {
  Card,
  Heading,
  Page,
  Pill,
  ProgressRing,
  SectionTitle,
} from "../../components/ui";
import { dateKey, useHabits } from "../../data/habits";
import { colors } from "../../theme";

export default function StatsScreen() {
  const [range, setRange] = useState("Week");
  const { data, getCount } = useHabits();
  const days = Array.from(
    { length: range === "Week" ? 7 : range === "Month" ? 30 : 365 },
    (_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - index);
      const completed = data.habits.filter(
        (habit) => getCount(habit.id, dateKey(date)) >= habit.target,
      ).length;
      return completed / Math.max(data.habits.length, 1);
    },
  );
  const rate = Math.round(
    (days.reduce((sum, value) => sum + value, 0) / Math.max(days.length, 1)) *
      100,
  );
  const ranked = data.habits
    .map((habit) => ({
      habit,
      count: data.completions.filter(
        (entry) => entry.habitId === habit.id && entry.count >= habit.target,
      ).length,
    }))
    .sort((a, b) => b.count - a.count);
  return (
    <Page>
      <Heading title="Statistics" subtitle="Small wins add up over time." />
      <View style={{ flexDirection: "row", gap: 8 }}>
        {["Week", "Month", "Year"].map((item) => (
          <Pill
            key={item}
            label={item}
            selected={range === item}
            onPress={() => setRange(item)}
          />
        ))}
      </View>
      <Card style={{ gap: 16 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View style={{ gap: 6 }}>
            <Text style={{ color: colors.muted, fontSize: 11 }}>
              Completion Rate
            </Text>
            <Text
              style={{ color: colors.ink, fontSize: 28, fontWeight: "800" }}
            >
              {rate}%
            </Text>
            <Text style={{ color: colors.green, fontSize: 10 }}>
              ↑ Keep your rhythm going
            </Text>
          </View>
          <ProgressRing value={rate} total={100} size={76} label="complete" />
        </View>
        <View
          style={{
            height: 108,
            flexDirection: "row",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 5,
            paddingTop: 8,
            borderTopWidth: 1,
            borderColor: colors.line,
          }}
        >
          {days
            .slice(0, 7)
            .reverse()
            .map((value, index) => (
              <View
                key={index}
                style={{
                  flex: 1,
                  height: "100%",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                <View
                  style={{
                    width: "70%",
                    height: Math.max(8, value * 76),
                    backgroundColor: value > 0 ? colors.green : "#E7EFED",
                    borderRadius: 6,
                  }}
                />
                <Text style={{ color: colors.muted, fontSize: 9 }}>
                  {(["M", "T", "W", "T", "F", "S", "S"] as const)[index]}
                </Text>
              </View>
            ))}
        </View>
      </Card>
      <SectionTitle title="Top Habits" />
      <Card style={{ gap: 3 }}>
        {ranked.map(({ habit, count }, index) => (
          <View
            key={habit.id}
            style={{
              minHeight: 54,
              flexDirection: "row",
              alignItems: "center",
              gap: 11,
              borderBottomWidth: 1,
              borderColor: "#F0F3F2",
            }}
          >
            <Text style={{ color: colors.faint, fontSize: 11, width: 14 }}>
              {index + 1}
            </Text>
            <View
              style={{
                width: 32,
                height: 32,
                borderRadius: 11,
                backgroundColor: habit.color,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MaterialCommunityIcons
                name={
                  habit.icon as keyof typeof MaterialCommunityIcons.glyphMap
                }
                size={17}
                color={colors.ink}
              />
            </View>
            <Text
              style={{
                color: colors.ink,
                flex: 1,
                fontSize: 11,
                fontWeight: "700",
              }}
            >
              {habit.name}
            </Text>
            <Text
              style={{ color: colors.green, fontSize: 10, fontWeight: "700" }}
            >
              {count} days
            </Text>
          </View>
        ))}
      </Card>
    </Page>
  );
}
