import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Alert, Platform, Pressable, Text, View } from "react-native";
import { AppButton, Card, Heading, IconButton, Page, ProgressRing, SectionTitle } from "../../components/ui";
import { dateKey, useHabits } from "../../data/habits";
import { colors } from "../../theme";

export default function HabitDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, getCount, logHabit, deleteHabit } = useHabits();
  const habit = data.habits.find((item) => item.id === id);
  if (!habit) return <Page><Heading title="Habit not found" /><AppButton title="Back to Home" onPress={() => router.replace("/(tabs)")} /></Page>;
  const count = getCount(habit.id);
  const week = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(); date.setDate(date.getDate() - 6 + index);
    const amount = getCount(habit.id, dateKey(date));
    return { label: date.toLocaleDateString("en", { weekday: "narrow" }), done: amount >= habit.target, today: index === 6 };
  });
  const addProgress = () => {
    if (count >= habit.target) return;
    logHabit(habit.id, 1);
    if (count + 1 >= habit.target) router.push({ pathname: "/success", params: { habitId: habit.id } });
  };
  const removeHabit = () => {
    const remove = () => { deleteHabit(habit.id); router.replace("/(tabs)"); };
    if (Platform.OS === "web") { if (window.confirm(`Delete “${habit.name}” and its history from this device?`)) remove(); return; }
    Alert.alert("Delete habit?", "This removes the habit and its saved history from this device.", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: remove },
    ]);
  };
  return (
    <Page>
      <Heading title="Habit Detail" right={<IconButton name="arrow-left" onPress={() => router.back()} />} />
      <View style={{ alignItems: "center", gap: 12, paddingVertical: 12 }}>
        <View style={{ width: 58, height: 58, borderRadius: 20, backgroundColor: habit.color, alignItems: "center", justifyContent: "center" }}><MaterialCommunityIcons name={habit.icon as keyof typeof MaterialCommunityIcons.glyphMap} size={28} color={colors.greenDark} /></View>
        <Text style={{ color: colors.ink, fontWeight: "800", fontSize: 19, textAlign: "center" }}>{habit.name}</Text>
        <Text style={{ color: colors.muted, fontSize: 11 }}>{habit.frequency} · Goal: {habit.target} {habit.unit}</Text>
        <ProgressRing value={count} total={habit.target} size={132} label={habit.unit} />
      </View>
      <AppButton title={count >= habit.target ? "Goal complete for today" : habit.target > 1 ? `Log 1 ${habit.unit.replace(/s$/, "")}` : "Log Habit"} onPress={addProgress} disabled={count >= habit.target} />
      {count > 0 ? <Pressable accessibilityRole="button" onPress={() => logHabit(habit.id, -1)} style={{ alignSelf: "center", padding: 8 }}><Text style={{ color: colors.muted, fontSize: 11, fontWeight: "600" }}>Undo last check-in ({count} logged)</Text></Pressable> : null}
      <SectionTitle title="This Week" />
      <Card style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 20 }}>
        {week.map((item, index) => <View key={`${item.label}-${index}`} style={{ alignItems: "center", gap: 9 }}><View style={{ width: 25, height: 42, borderRadius: 13, backgroundColor: item.done ? colors.green : "#EEF2F2", alignItems: "center", justifyContent: "center" }}>{item.done ? <MaterialCommunityIcons name="check" size={15} color={colors.white} /> : null}</View><Text style={{ color: item.today ? colors.green : colors.muted, fontSize: 10, fontWeight: item.today ? "800" : "500" }}>{item.label}</Text></View>)}
      </Card>
      <Card><Text style={{ color: colors.ink, fontSize: 12, fontWeight: "700" }}>A steady rhythm</Text><Text style={{ color: colors.muted, fontSize: 11, lineHeight: 17, marginTop: 5 }}>Every check-in is progress. Keep showing up for yourself, one day at a time.</Text></Card>
      <View style={{ flexDirection: "row", gap: 10 }}><View style={{ flex: 1 }}><AppButton title="Edit" variant="outline" onPress={() => router.push({ pathname: "/add-habit", params: { habitId: habit.id } })} /></View><View style={{ flex: 1 }}><AppButton title="Delete" variant="text" onPress={removeHabit} /></View></View>
    </Page>
  );
}
