import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { Text, View } from "react-native";
import { Card, Heading, Page, Pill, ProgressRing, SectionTitle } from "../../components/ui";
import { dateKey, useHabits } from "../../data/habits";
import { colors } from "../../theme";

const RANGE_DAYS = { Week: 7, Month: 30, Year: 365 } as const;
type Range = keyof typeof RANGE_DAYS;

export default function StatsScreen() {
  const [range, setRange] = useState<Range>("Week");
  const { data, getCount } = useHabits();
  const period = useMemo(() => {
    const numberOfDays = RANGE_DAYS[range];
    const values = Array.from({ length: numberOfDays }, (_, index) => {
      const date = new Date(); date.setDate(date.getDate() - (numberOfDays - index - 1));
      const completed = data.habits.filter((habit) => getCount(habit.id, dateKey(date)) >= habit.target).length;
      return { date, completed, ratio: completed / Math.max(data.habits.length, 1) };
    });
    const possible = values.length * data.habits.length;
    const completed = values.reduce((total, item) => total + item.completed, 0);
    return { values, rate: possible ? Math.round((completed / possible) * 100) : 0 };
  }, [data.habits, range, getCount]);
  const bars = useMemo(() => {
    if (range === "Week") return period.values.map((item) => ({ ratio: item.ratio, label: item.date.toLocaleDateString("en", { weekday: "narrow" }) }));
    const buckets = range === "Month" ? 5 : 12;
    return Array.from({ length: buckets }, (_, index) => {
      const start = Math.floor((index * period.values.length) / buckets);
      const end = Math.floor(((index + 1) * period.values.length) / buckets);
      const entries = period.values.slice(start, Math.max(end, start + 1));
      const ratio = entries.length ? entries.reduce((sum, item) => sum + item.ratio, 0) / entries.length : 0;
      const labelDate = new Date(); labelDate.setMonth(labelDate.getMonth() - (buckets - 1 - index));
      return { ratio, label: range === "Month" ? `W${index + 1}` : labelDate.toLocaleDateString("en", { month: "narrow" }) };
    });
  }, [period.values, range]);
  const ranked = data.habits.map((habit) => {
    const completedDays = period.values.filter((item) => getCount(habit.id, dateKey(item.date)) >= habit.target).length;
    return { habit, completedDays, rate: period.values.length ? Math.round((completedDays / period.values.length) * 100) : 0 };
  }).sort((a, b) => b.rate - a.rate || a.habit.name.localeCompare(b.habit.name));
  return (
    <Page>
      <Heading title="Statistics" subtitle="Small wins add up over time." />
      <View style={{ flexDirection: "row", gap: 8 }}>{(["Week", "Month", "Year"] as const).map((item) => <Pill key={item} label={item} selected={range === item} onPress={() => setRange(item)} />)}</View>
      <Card style={{ gap: 16 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}><View style={{ gap: 6, flex: 1 }}><Text style={{ color: colors.muted, fontSize: 11 }}>Completion Rate · {range}</Text><Text style={{ color: colors.ink, fontSize: 28, fontWeight: "800" }}>{period.rate}%</Text><Text style={{ color: colors.green, fontSize: 10 }}>{data.habits.length ? "Keep your rhythm going" : "Add a habit to start tracking"}</Text></View><ProgressRing value={period.rate} total={100} size={76} label="complete" /></View>
        <View style={{ height: 122, flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", gap: 5, paddingTop: 8, borderTopWidth: 1, borderColor: colors.line }}>{bars.map((item, index) => <View key={`${item.label}-${index}`} style={{ flex: 1, height: "100%", justifyContent: "flex-end", alignItems: "center", gap: 5 }}><View style={{ width: "70%", height: Math.max(8, item.ratio * 78), backgroundColor: item.ratio > 0 ? colors.green : "#E7EFED", borderRadius: 6 }} /><Text style={{ color: colors.muted, fontSize: 8 }}>{item.label}</Text></View>)}</View>
      </Card>
      <SectionTitle title="Top Habits" />
      {ranked.length ? <Card style={{ gap: 3 }}>{ranked.map(({ habit, completedDays, rate }, index) => <View key={habit.id} style={{ minHeight: 54, flexDirection: "row", alignItems: "center", gap: 11, borderBottomWidth: 1, borderColor: "#F0F3F2" }}><Text style={{ color: colors.faint, fontSize: 11, width: 14 }}>{index + 1}</Text><View style={{ width: 32, height: 32, borderRadius: 11, backgroundColor: habit.color, alignItems: "center", justifyContent: "center" }}><MaterialCommunityIcons name={habit.icon as keyof typeof MaterialCommunityIcons.glyphMap} size={17} color={colors.ink} /></View><Text numberOfLines={1} style={{ color: colors.ink, flex: 1, fontSize: 11, fontWeight: "700" }}>{habit.name}</Text><Text style={{ color: colors.green, fontSize: 10, fontWeight: "700" }}>{rate}% · {completedDays} days</Text></View>)}</Card> : <Card><Text style={{ color: colors.muted, fontSize: 12 }}>Your habits and check-ins will appear here.</Text></Card>}
    </Page>
  );
}
