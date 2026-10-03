import { Text } from "react-native";
import { Card, Heading, Page } from "../components/ui";
import { useHabits } from "../data/habits";
import { colors } from "../theme";

export default function GoalsScreen() {
  const { data } = useHabits();
  return (
    <Page>
      <Heading
        title="My Goals"
        subtitle="Your habits are the goals you show up for."
      />
      {data.habits.map((habit) => (
        <Card key={habit.id}>
          <Text style={{ color: colors.ink, fontSize: 13, fontWeight: "700" }}>
            {habit.name}
          </Text>
          <Text style={{ color: colors.muted, fontSize: 11, marginTop: 5 }}>
            {habit.frequency} · {habit.target} {habit.unit}
          </Text>
        </Card>
      ))}
    </Page>
  );
}
