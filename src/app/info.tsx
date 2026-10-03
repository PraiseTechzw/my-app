import { router, useLocalSearchParams } from "expo-router";
import { Text } from "react-native";
import { AppButton, Card, Heading, Page } from "../components/ui";
import { colors } from "../theme";

const details: Record<string, string> = {
  Appearance: "FocusFlow currently uses a light interface. Your habit information remains saved locally on this device.",
  Language: "The app is currently available in English.",
  Privacy: "FocusFlow stores your habits, check-ins, onboarding status, and preferences in local device storage. This app does not connect to an account or send this information to a server.",
  Security: "Your app data remains in this device's local app storage. Protect access to this device with its operating-system passcode.",
  "Local storage details": "Habits and check-ins are stored with AsyncStorage on this device. Removing app data or uninstalling the app may permanently erase this information. There is no cloud sync or remote recovery.",
  "Help & Support": "FocusFlow is a local-first habit tracker. For help using the app, create a habit, log progress from the home screen or habit details, and review your history in Calendar or Statistics.",
};

export default function InfoScreen() {
  const { page } = useLocalSearchParams<{ page: string }>();
  const title = page ?? "Information";
  return (
    <Page>
      <Heading title={title} />
      <Card><Text style={{ color: colors.ink, fontSize: 13, lineHeight: 21 }}>{details[title] ?? "This option is not connected to an account or remote service in this local-only app."}</Text></Card>
      <Text style={{ color: colors.muted, fontSize: 10, lineHeight: 16 }}>This app is designed to work without an internet connection or backend.</Text>
      <AppButton title="Go back" variant="outline" onPress={() => router.back()} />
    </Page>
  );
}
