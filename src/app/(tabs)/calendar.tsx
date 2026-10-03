import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Card, Heading, IconButton, Page, SectionTitle } from "../../components/ui";
import { dateKey, useHabits } from "../../data/habits";
import { colors } from "../../theme";

export default function CalendarScreen() {
  const [monthOffset, setMonthOffset] = useState(0);
  const [selected, setSelected] = useState(dateKey(new Date()));
  const base = new Date(); base.setDate(1); base.setMonth(base.getMonth() + monthOffset);
  const year = base.getFullYear(); const month = base.getMonth();
  const monthTitle = base.toLocaleDateString("en", { month: "long", year: "numeric" });
  const firstDay = (new Date(year, month, 1).getDay() + 6) % 7;
  const dayCount = new Date(year, month + 1, 0).getDate();
  const cells = [...Array(firstDay).fill(0), ...Array.from({ length: dayCount }, (_, index) => index + 1)];
  const { data, getCount } = useHabits();
  const selectedDate = new Date(`${selected}T12:00:00`);
  const selectedLabel = selectedDate.toLocaleDateString("en", { weekday: "long", month: "long", day: "numeric" });
  const selectedHabits = data.habits.map((habit) => ({ habit, count: getCount(habit.id, selected) }));
  const moveMonth = (delta: number) => { const next = new Date(year, month + delta, 1); setMonthOffset((value) => value + delta); setSelected(dateKey(next)); };
  return (
    <Page>
      <Heading title="Calendar" subtitle="Your consistency, day by day." />
      <Card>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}><IconButton name="chevron-left" onPress={() => moveMonth(-1)} /><Text style={{ color: colors.ink, fontSize: 14, fontWeight: "800" }}>{monthTitle}</Text><IconButton name="chevron-right" onPress={() => moveMonth(1)} /></View>
        <View style={{ flexDirection: "row", marginBottom: 8 }}>{["M", "T", "W", "T", "F", "S", "S"].map((label, index) => <Text key={`${label}-${index}`} style={{ flex: 1, textAlign: "center", color: colors.muted, fontSize: 10, fontWeight: "700" }}>{label}</Text>)}</View>
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>{cells.map((day, index) => {
          const key = day ? dateKey(new Date(year, month, day)) : `blank-${index}`;
          const completed = day ? data.habits.some((habit) => getCount(habit.id, key) >= habit.target) : false;
          const active = key === selected; const isToday = key === dateKey(new Date());
          return <Pressable disabled={!day} key={key} onPress={() => setSelected(key)} accessibilityRole={day ? "button" : undefined} accessibilityLabel={day ? new Date(year, month, day).toLocaleDateString("en", { month: "long", day: "numeric" }) : undefined} style={{ width: "14.285%", height: 41, alignItems: "center", justifyContent: "center" }}><View style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: active ? colors.green : completed ? colors.mint : "transparent", alignItems: "center", justifyContent: "center", borderWidth: isToday && !active ? 1 : 0, borderColor: colors.green }}>{day ? <Text style={{ color: active ? colors.white : colors.ink, fontSize: 10, fontWeight: active || isToday ? "800" : "500" }}>{day}</Text> : null}</View>{completed && !active ? <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: colors.green, position: "absolute", bottom: 1 }} /> : null}</Pressable>;
        })}</View>
      </Card>
      <SectionTitle title={selectedLabel} />
      {selectedHabits.length ? <Card>{selectedHabits.map(({ habit, count }) => <Pressable key={habit.id} onPress={() => router.push({ pathname: "/habit/[id]", params: { id: habit.id } })} style={{ minHeight: 48, flexDirection: "row", alignItems: "center", gap: 10, borderBottomWidth: 1, borderColor: "#F0F3F2" }}><View style={{ width: 29, height: 29, borderRadius: 10, backgroundColor: habit.color, alignItems: "center", justifyContent: "center" }}><MaterialCommunityIcons name={habit.icon as keyof typeof MaterialCommunityIcons.glyphMap} size={16} color={colors.ink} /></View><View style={{ flex: 1 }}><Text numberOfLines={1} style={{ color: colors.ink, fontSize: 11, fontWeight: "600" }}>{habit.name}</Text><Text style={{ color: colors.muted, fontSize: 9, marginTop: 2 }}>{count}/{habit.target} {habit.unit}</Text></View><MaterialCommunityIcons name={count >= habit.target ? "check-circle" : "circle-outline"} size={18} color={count >= habit.target ? colors.green : colors.faint} /></Pressable>)}</Card> : <Card><Text style={{ color: colors.muted, fontSize: 12 }}>No habits yet. Add a habit to see your calendar.</Text></Card>}
    </Page>
  );
}
