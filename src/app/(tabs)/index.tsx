import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
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
      <LinearGradient
        colors={["#12C6A0", "#008C86", "#007B78"]}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
        style={{
          minHeight: 126,
          borderRadius: 18,
          paddingHorizontal: 18,
          paddingVertical: 14,
          flexDirection: "row",
          alignItems: "center",
          gap: 18,
          overflow: "hidden",
        }}
      >
        <ProgressRing
          value={done}
          total={data.habits.length}
          color="#FFFFFF"
          trackColor="#FFFFFF55"
          textColor="#FFFFFF"
          labelColor="#E3FFF7"
          size={78}
          label="completed"
        />
        <View style={{ flex: 1, gap: 5 }}>
          <Text style={{ color: "#D8FFF3", fontSize: 10, fontWeight: "700" }}>
            TODAY&apos;S PROGRESS
          </Text>
          <Text
            style={{ color: colors.white, fontSize: 16, fontWeight: "800" }}
          >
            Keep going!
          </Text>
          <Text style={{ color: "#E5FFF6", fontSize: 10, lineHeight: 15 }}>
            You&apos;re doing great this week.
          </Text>
        </View>
        <MaterialCommunityIcons
          name="trending-up"
          size={21}
          color="#D8FFF380"
          style={{ position: "absolute", right: 14, top: 12 }}
        />
      </LinearGradient>
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
