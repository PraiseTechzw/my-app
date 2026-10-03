import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import {
  AppButton,
  Card,
  Heading,
  Page,
  ProgressRing,
  SectionTitle,
} from "../../components/ui";
import { useHabits } from "../../data/habits";
import { colors } from "../../theme";

export default function HomeScreen() {
  const { data, getCount } = useHabits();
  const done = data.habits.filter(
    (habit) => getCount(habit.id) >= habit.target,
  ).length;
  return (
    <Page>
      <Heading
        title="Good morning, Praise"
        subtitle="Let's make today count."
        right={
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: "#D6EEE6",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: colors.greenDark, fontWeight: "800" }}>
              P
            </Text>
          </View>
        }
      />
      <Card
        style={{
          backgroundColor: colors.green,
          borderColor: colors.green,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          minHeight: 142,
        }}
      >
        <View style={{ flex: 1, gap: 9 }}>
          <Text style={{ color: "#D8F5EC", fontSize: 11, fontWeight: "700" }}>
            TODAY&apos;S PROGRESS
          </Text>
          <Text
            style={{ color: colors.white, fontSize: 23, fontWeight: "800" }}
          >
            {done} of {data.habits.length}
          </Text>
          <Text style={{ color: "#E5FFF6", fontSize: 11 }}>
            Keep going! You&apos;re doing great.
          </Text>
        </View>
        <ProgressRing
          value={done}
          total={data.habits.length}
          color="#FFFFFF"
          size={84}
          label="habits"
        />
      </Card>
      <SectionTitle
        title="Today's Habits"
        action="See all"
        onAction={() => router.push("/(tabs)/calendar")}
      />
      <Card style={{ paddingVertical: 4 }}>
        {data.habits.map((habit) => {
          const count = getCount(habit.id);
          const complete = count >= habit.target;
          return (
            <Pressable
              key={habit.id}
              onPress={() =>
                router.push({
                  pathname: "/habit/[id]",
                  params: { id: habit.id },
                })
              }
              style={{
                minHeight: 58,
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                borderBottomWidth: 1,
                borderColor: "#F0F3F2",
              }}
            >
              <View
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 12,
                  backgroundColor: habit.color,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MaterialCommunityIcons
                  name={
                    habit.icon as keyof typeof MaterialCommunityIcons.glyphMap
                  }
                  size={18}
                  color={colors.ink}
                />
              </View>
              <View style={{ flex: 1, gap: 3 }}>
                <Text
                  style={{ color: colors.ink, fontSize: 12, fontWeight: "700" }}
                >
                  {habit.name}
                </Text>
                <Text style={{ color: colors.muted, fontSize: 10 }}>
                  {count > 0
                    ? `${count}/${habit.target} ${habit.unit}`
                    : habit.frequency}
                </Text>
              </View>
              <View
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  borderWidth: 1.5,
                  borderColor: complete ? colors.green : "#CCD7D7",
                  backgroundColor: complete ? colors.green : "transparent",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {complete ? (
                  <MaterialCommunityIcons
                    name="check"
                    size={15}
                    color={colors.white}
                  />
                ) : null}
              </View>
            </Pressable>
          );
        })}
      </Card>
      <AppButton
        title="Add a Habit"
        onPress={() => router.push("/add-habit")}
        variant="outline"
      />
    </Page>
  );
}
