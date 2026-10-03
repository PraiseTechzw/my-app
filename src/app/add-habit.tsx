import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import {
  AppButton,
  AppInput,
  Card,
  Heading,
  IconButton,
  Page,
  Pill,
} from "../components/ui";
import { useHabits } from "../data/habits";
import { colors } from "../theme";

const habitIcons = [
  { name: "book-open-page-variant-outline", color: "#EFE8FF" },
  { name: "dumbbell", color: "#E3F8F1" },
  { name: "water-outline", color: "#DCEBFF" },
  { name: "meditation", color: "#FCE8E5" },
  { name: "school-outline", color: "#FFF1D8" },
  { name: "walk", color: "#FCE9D8" },
  { name: "heart-pulse", color: "#FBE3E6" },
];
const weekdays = ["S", "M", "T", "W", "T", "F", "S"];

export default function AddHabitScreen() {
  const { habitId } = useLocalSearchParams<{ habitId?: string }>();
  const { data, addHabit, updateHabit } = useHabits();
  const existing = data.habits.find((habit) => habit.id === habitId);
  const [name, setName] = useState(existing?.name ?? "");
  const [iconIndex, setIconIndex] = useState(
    Math.max(0, habitIcons.findIndex((icon) => icon.name === existing?.icon)),
  );
  const [frequency, setFrequency] = useState<"Daily" | "Weekly" | "Custom">(
    existing?.frequency ?? "Daily",
  );
  const [customDays, setCustomDays] = useState<number[]>(existing?.customDays ?? [1, 2, 3, 4, 5]);
  const [target, setTarget] = useState(String(existing?.target ?? 1));
  const [unit, setUnit] = useState(existing?.unit ?? "session");
  const [reminder, setReminder] = useState(!!existing?.reminder);
  const [error, setError] = useState("");

  const save = () => {
    const trimmed = name.trim();
    const parsedTarget = Number.parseInt(target, 10);
    if (!trimmed) return setError("Add a name for your habit.");
    if (!Number.isFinite(parsedTarget) || parsedTarget < 1 || parsedTarget > 999) {
      return setError("Set a daily target between 1 and 999.");
    }
    if (!unit.trim()) return setError("Add a unit, such as minutes or sessions.");
    if (frequency === "Custom" && customDays.length === 0) {
      return setError("Choose at least one day for a custom schedule.");
    }
    const icon = habitIcons[iconIndex];
    const habit = {
      name: trimmed,
      icon: icon.name,
      color: icon.color,
      target: parsedTarget,
      unit: unit.trim(),
      frequency,
      customDays: frequency === "Custom" ? customDays : undefined,
      reminder: reminder ? "09:00 AM" : undefined,
    } as const;
    if (existing) updateHabit(existing.id, habit);
    else addHabit(habit);
    router.back();
  };

  return (
    <Page>
      <Heading
        title={existing ? "Edit Habit" : "Add New Habit"}
        subtitle="Small steps, repeated, change everything."
        right={<IconButton name="close" onPress={() => router.back()} />}
      />
      <AppInput
        label="Habit name"
        placeholder="e.g. Read for 20 minutes"
        value={name}
        onChangeText={(value) => { setName(value); setError(""); }}
        returnKeyType="done"
        maxLength={60}
      />
      <Card>
        <Text style={{ color: colors.ink, fontWeight: "700", fontSize: 12, marginBottom: 12 }}>
          Choose an icon
        </Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
          {habitIcons.map((icon, index) => (
            <Pressable
              key={icon.name}
              accessibilityRole="button"
              accessibilityLabel={`Choose ${icon.name} icon`}
              onPress={() => setIconIndex(index)}
              style={{
                width: 48, height: 48, borderRadius: 15, backgroundColor: icon.color,
                alignItems: "center", justifyContent: "center",
                borderWidth: index === iconIndex ? 2 : 0,
                borderColor: colors.green,
              }}
            >
              <MaterialCommunityIcons name={icon.name as keyof typeof MaterialCommunityIcons.glyphMap} size={22} color={colors.ink} />
            </Pressable>
          ))}
        </View>
      </Card>
      <View style={{ flexDirection: "row", gap: 12 }}>
        <View style={{ flex: 0.8 }}>
          <AppInput label="Daily target" placeholder="1" value={target} onChangeText={setTarget} keyboardType="number-pad" />
        </View>
        <View style={{ flex: 1.2 }}>
          <AppInput label="Unit" placeholder="sessions" value={unit} onChangeText={setUnit} maxLength={24} />
        </View>
      </View>
      <View style={{ gap: 10 }}>
        <Text style={{ color: colors.ink, fontWeight: "700", fontSize: 12 }}>Frequency</Text>
        <View style={{ flexDirection: "row", gap: 9 }}>
          {(["Daily", "Weekly", "Custom"] as const).map((value) => (
            <Pill key={value} label={value} selected={frequency === value} onPress={() => setFrequency(value)} />
          ))}
        </View>
        {frequency === "Custom" ? (
          <View style={{ flexDirection: "row", gap: 8 }}>
            {weekdays.map((day, index) => {
              const selected = customDays.includes(index);
              return (
                <Pressable
                  key={`${day}-${index}`}
                  accessibilityRole="button"
                  accessibilityLabel={`${selected ? "Remove" : "Add"} ${["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][index]}`}
                  onPress={() => setCustomDays((current) => selected ? current.filter((item) => item !== index) : [...current, index].sort())}
                  style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: selected ? colors.green : colors.white, alignItems: "center", justifyContent: "center", borderWidth: selected ? 0 : 1, borderColor: colors.line }}
                >
                  <Text style={{ color: selected ? colors.white : colors.muted, fontSize: 11, fontWeight: "700" }}>{day}</Text>
                </Pressable>
              );
            })}
          </View>
        ) : null}
      </View>
      <Card>
        <Pressable onPress={() => setReminder((value) => !value)} style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <View style={{ width: 34, height: 34, borderRadius: 11, backgroundColor: "#F1F6F4", alignItems: "center", justifyContent: "center" }}>
            <MaterialCommunityIcons name="bell-outline" size={18} color={colors.ink} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.ink, fontSize: 12, fontWeight: "700" }}>Reminder preference</Text>
            <Text style={{ color: colors.muted, fontSize: 10, marginTop: 3 }}>{reminder ? "09:00 AM · stored on this device" : "Off"}</Text>
          </View>
          <MaterialCommunityIcons name={reminder ? "toggle-switch" : "toggle-switch-off-outline"} size={28} color={reminder ? colors.green : colors.faint} />
        </Pressable>
        <Text style={{ color: colors.faint, fontSize: 10, lineHeight: 15, marginTop: 10 }}>
          This saves your preferred time locally; this version does not schedule system notifications.
        </Text>
      </Card>
      {error ? <Text accessibilityRole="alert" style={{ color: colors.red, fontSize: 12 }}>{error}</Text> : null}
      <AppButton title={existing ? "Save Changes" : "Save Habit"} onPress={save} />
    </Page>
  );
}
