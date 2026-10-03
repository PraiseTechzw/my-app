import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
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
];

export default function AddHabitScreen() {
  const { addHabit } = useHabits();
  const [name, setName] = useState("");
  const [iconIndex, setIconIndex] = useState(0);
  const [frequency, setFrequency] = useState<"Daily" | "Weekly" | "Custom">(
    "Daily",
  );
  const [reminder, setReminder] = useState(false);
  const [error, setError] = useState("");
  const save = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Add a name for your habit.");
      return;
    }
    const icon = habitIcons[iconIndex];
    addHabit({
      name: trimmed,
      icon: icon.name,
      color: icon.color,
      target: 1,
      unit: "session",
      frequency,
      reminder: reminder ? "09:00 AM" : undefined,
    });
    router.back();
  };

  return (
    <Page>
      <Heading
        title="Add New Habit"
        subtitle="A small step, repeated, changes everything."
        right={<IconButton name="close" onPress={() => router.back()} />}
      />
      <AppInput
        label="Habit name"
        placeholder="e.g. Read for 20 minutes"
        value={name}
        onChangeText={(value) => {
          setName(value);
          setError("");
        }}
        returnKeyType="done"
      />
      {error ? (
        <Text style={{ color: colors.red, fontSize: 12 }}>{error}</Text>
      ) : null}
      <Card>
        <Text
          style={{
            color: colors.ink,
            fontWeight: "700",
            fontSize: 12,
            marginBottom: 12,
          }}
        >
          Choose an icon
        </Text>
        <View
          style={{
            flexDirection: "row",
            gap: 10,
            justifyContent: "space-between",
          }}
        >
          {habitIcons.map((icon, index) => (
            <Pressable
              key={icon.name}
              onPress={() => setIconIndex(index)}
              style={{
                width: 48,
                height: 48,
                borderRadius: 15,
                backgroundColor: icon.color,
                alignItems: "center",
                justifyContent: "center",
                borderWidth: index === iconIndex ? 2 : 0,
                borderColor: colors.green,
              }}
            >
              <MaterialCommunityIcons
                name={icon.name as keyof typeof MaterialCommunityIcons.glyphMap}
                size={22}
                color={colors.ink}
              />
            </Pressable>
          ))}
        </View>
      </Card>
      <View style={{ gap: 10 }}>
        <Text style={{ color: colors.ink, fontWeight: "700", fontSize: 12 }}>
          Frequency
        </Text>
        <View style={{ flexDirection: "row", gap: 9 }}>
          {(["Daily", "Weekly", "Custom"] as const).map((value) => (
            <Pill
              key={value}
              label={value}
              selected={frequency === value}
              onPress={() => setFrequency(value)}
            />
          ))}
        </View>
      </View>
      <Card>
        <Pressable
          onPress={() => setReminder((value) => !value)}
          style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
        >
          <View
            style={{
              width: 34,
              height: 34,
              borderRadius: 11,
              backgroundColor: "#F1F6F4",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MaterialCommunityIcons
              name="bell-outline"
              size={18}
              color={colors.ink}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={{ color: colors.ink, fontSize: 12, fontWeight: "700" }}
            >
              Reminder (optional)
            </Text>
            <Text style={{ color: colors.muted, fontSize: 10, marginTop: 3 }}>
              {reminder ? "09:00 AM" : "No reminder set"}
            </Text>
          </View>
          <MaterialCommunityIcons
            name={reminder ? "toggle-switch" : "toggle-switch-off-outline"}
            size={28}
            color={reminder ? colors.green : colors.faint}
          />
        </Pressable>
      </Card>
      <AppButton title="Save Habit" onPress={save} />
    </Page>
  );
}
