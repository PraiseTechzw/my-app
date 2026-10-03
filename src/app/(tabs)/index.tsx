import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { Card, Heading, Page, ProgressRing, SectionTitle } from "../../components/ui";
import { useHabits } from "../../data/habits";
import { colors } from "../../theme";

export default function HomeScreen() {
  const { data, getCount, logHabit } = useHabits();
  const done = data.habits.filter((habit) => getCount(habit.id) >= habit.target).length;
  const dateLabel = new Date().toLocaleDateString("en", { weekday: "long", month: "long", day: "numeric" });
  return (
    <Page>
      <Heading
        title={`Good morning, ${data.profileName.split(" ")[0]}`}
        subtitle={`${dateLabel} · Let's make today count.`}
        right={<Pressable onPress={() => router.push("/(tabs)/profile")} accessibilityRole="button" accessibilityLabel="Open profile"><View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: "#D6EEE6", alignItems: "center", justifyContent: "center" }}><Text style={{ color: colors.greenDark, fontWeight: "800" }}>{data.profileName.slice(0, 1).toUpperCase()}</Text></View></Pressable>}
      />
      <Card style={{ backgroundColor: colors.green, borderColor: colors.green, flexDirection: "row", alignItems: "center", justifyContent: "space-between", minHeight: 142 }}>
        <View style={{ flex: 1, gap: 9 }}>
          <Text style={{ color: "#D8F5EC", fontSize: 11, fontWeight: "700" }}>TODAY&apos;S PROGRESS</Text>
          <Text style={{ color: colors.white, fontSize: 23, fontWeight: "800" }}>{done} of {data.habits.length} habits</Text>
          <Text style={{ color: "#E5FFF6", fontSize: 11 }}>{done === data.habits.length && data.habits.length > 0 ? "You showed up for every habit today." : "A little progress still moves you forward."}</Text>
        </View>
        <ProgressRing value={done} total={data.habits.length} color="#FFFFFF" size={84} label="complete" />
      </Card>
      <SectionTitle title="Today's Habits" action="See all" onAction={() => router.push("/(tabs)/calendar")} />
      {data.habits.length === 0 ? (
        <Card style={{ alignItems: "center", gap: 10, paddingVertical: 26 }}>
          <MaterialCommunityIcons name="sprout-outline" size={30} color={colors.green} />
          <Text style={{ color: colors.ink, fontSize: 14, fontWeight: "700" }}>Start with one small habit</Text>
          <Text style={{ color: colors.muted, fontSize: 11, textAlign: "center" }}>Create a simple daily goal and build momentum.</Text>
          <Pressable onPress={() => router.push("/add-habit")}><Text style={{ color: colors.green, fontWeight: "700", fontSize: 12 }}>Add your first habit</Text></Pressable>
        </Card>
      ) : (
        <Card style={{ paddingVertical: 4 }}>
          {data.habits.map((habit) => {
            const count = getCount(habit.id);
            const complete = count >= habit.target;
            return (
              <View key={habit.id} style={{ minHeight: 58, flexDirection: "row", alignItems: "center", gap: 12, borderBottomWidth: 1, borderColor: "#F0F3F2" }}>
                <Pressable onPress={() => router.push({ pathname: "/habit/[id]", params: { id: habit.id } })} accessibilityRole="button" accessibilityLabel={`Open ${habit.name}`} style={{ flex: 1, minHeight: 58, flexDirection: "row", alignItems: "center", gap: 12 }}>
                  <View style={{ width: 34, height: 34, borderRadius: 12, backgroundColor: habit.color, alignItems: "center", justifyContent: "center" }}><MaterialCommunityIcons name={habit.icon as keyof typeof MaterialCommunityIcons.glyphMap} size={18} color={colors.ink} /></View>
                  <View style={{ flex: 1, gap: 3 }}><Text numberOfLines={1} style={{ color: colors.ink, fontSize: 12, fontWeight: "700" }}>{habit.name}</Text><Text style={{ color: colors.muted, fontSize: 10 }}>{count > 0 ? `${count}/${habit.target} ${habit.unit}` : habit.frequency}</Text></View>
                </Pressable>
                <Pressable onPress={() => {
                  if (complete && habit.target === 1) logHabit(habit.id, -1);
                  else if (!complete) {
                    logHabit(habit.id, 1);
                    if (count + 1 >= habit.target) router.push({ pathname: "/success", params: { habitId: habit.id } });
                  }
                }} accessibilityRole="button" accessibilityLabel={complete ? `Undo ${habit.name} completion` : `Log ${habit.name}`} style={{ width: 36, height: 48, alignItems: "center", justifyContent: "center" }}>
                  <View style={{ width: 24, height: 24, borderRadius: 12, borderWidth: 1.5, borderColor: complete ? colors.green : "#CCD7D7", backgroundColor: complete ? colors.green : "transparent", alignItems: "center", justifyContent: "center" }}>{complete ? <MaterialCommunityIcons name="check" size={15} color={colors.white} /> : <MaterialCommunityIcons name="plus" size={15} color={colors.muted} />}</View>
                </Pressable>
              </View>
            );
          })}
        </Card>
      )}
      <Pressable onPress={() => router.push("/(tabs)/stats")} style={{ paddingVertical: 4 }}><Text style={{ color: colors.green, fontSize: 12, fontWeight: "700" }}>Review your progress →</Text></Pressable>
    </Page>
  );
}
