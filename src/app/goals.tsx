import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { Card, Heading, Page, ProgressRing } from "../components/ui";
import { useHabits } from "../data/habits";
import { colors } from "../theme";

export default function GoalsScreen() {
  const { data, getCount } = useHabits();
  return (
    <Page>
      <Heading title="My Goals" subtitle="Your habits are the goals you show up for." />
      {data.habits.length ? data.habits.map((habit) => {
        const count = getCount(habit.id);
        return <Pressable key={habit.id} onPress={() => router.push({ pathname: "/habit/[id]", params: { id: habit.id } })} accessibilityRole="button" accessibilityLabel={`View goal ${habit.name}`}>
          <Card style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
            <View style={{ width: 42, height: 42, borderRadius: 14, backgroundColor: habit.color, alignItems: "center", justifyContent: "center" }}><MaterialCommunityIcons name={habit.icon as keyof typeof MaterialCommunityIcons.glyphMap} size={21} color={colors.ink} /></View>
            <View style={{ flex: 1, gap: 5 }}><Text numberOfLines={2} style={{ color: colors.ink, fontSize: 13, fontWeight: "700" }}>{habit.name}</Text><Text style={{ color: colors.muted, fontSize: 10 }}>{habit.frequency} · {habit.target} {habit.unit}</Text></View>
            <ProgressRing value={count} total={habit.target} size={52} />
          </Card>
        </Pressable>;
      }) : <Card style={{ alignItems: "center", gap: 10, paddingVertical: 28 }}><MaterialCommunityIcons name="target" size={30} color={colors.green} /><Text style={{ color: colors.ink, fontWeight: "700", fontSize: 14 }}>No goals yet</Text><Text style={{ color: colors.muted, fontSize: 11, textAlign: "center" }}>Add your first habit to set a goal you can work toward.</Text><Pressable onPress={() => router.push("/add-habit")}><Text style={{ color: colors.green, fontWeight: "700", fontSize: 12 }}>Create a habit</Text></Pressable></Card>}
    </Page>
  );
}
