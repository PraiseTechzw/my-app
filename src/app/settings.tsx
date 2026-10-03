import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Alert, Platform, Switch, Text, View } from "react-native";
import { Card, Heading, Page, RowItem } from "../components/ui";
import { useHabits } from "../data/habits";
import { colors } from "../theme";

export default function SettingsScreen() {
  const { data, setNotifications, resetLocalData } = useHabits();
  const info = (page: string) => router.push({ pathname: "/info", params: { page } });
  const confirmReset = () => {
    const reset = () => { resetLocalData(); router.replace("/(tabs)"); };
    if (Platform.OS === "web") {
      if (window.confirm("Reset FocusFlow on this device? This deletes your habits, check-ins, and preferences.")) reset();
      return;
    }
    Alert.alert("Reset local app data?", "This permanently removes your habits, check-ins, and preferences from this device.", [
      { text: "Cancel", style: "cancel" },
      { text: "Reset data", style: "destructive", onPress: reset },
    ]);
  };
  return (
    <Page>
      <Heading title="Settings" right={<MaterialCommunityIcons name="dots-vertical" size={20} color={colors.ink} />} />
      <Text style={{ color: colors.muted, fontSize: 10, fontWeight: "800", marginBottom: -8 }}>GENERAL</Text>
      <Card style={{ paddingVertical: 4 }}>
        <RowItem icon="weather-night" title="Appearance" value="Light" onPress={() => info("Appearance")} />
        <RowItem icon="bell-outline" title="Notification preference" trailing={<Switch value={data.notifications} onValueChange={setNotifications} accessibilityLabel="Enable notification preference" trackColor={{ false: "#D8E1E0", true: "#72C5A8" }} thumbColor={data.notifications ? colors.green : "#FFFFFF"} />} />
        <RowItem icon="translate" title="Language" value="English" onPress={() => info("Language")} />
      </Card>
      <View style={{ backgroundColor: "#FFF8E9", borderRadius: 12, padding: 12 }}>
        <Text style={{ color: "#816522", fontSize: 10, lineHeight: 15 }}>Notification preference is saved on this device, but system notifications are not scheduled in this version. The app currently uses the light appearance.</Text>
      </View>
      <Text style={{ color: colors.muted, fontSize: 10, fontWeight: "800", marginBottom: -8 }}>YOUR DATA</Text>
      <Card style={{ paddingVertical: 4 }}>
        <RowItem icon="shield-lock-outline" title="Privacy" onPress={() => info("Privacy")} />
        <RowItem icon="database-lock-outline" title="Local storage details" onPress={() => info("Local storage details")} />
        <RowItem icon="delete-outline" title="Reset all local data" onPress={confirmReset} />
      </Card>
      <Text style={{ color: colors.faint, fontSize: 10, lineHeight: 16 }}>Habits and check-ins are stored on this device using local storage. No account or remote backend is connected.</Text>
      {data.profileName ? null : <Text style={{ color: colors.red, fontSize: 11 }}>Add a profile name in Profile.</Text>}
    </Page>
  );
}
