import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Switch, Text } from "react-native";
import { Card, Heading, Page, RowItem } from "../components/ui";
import { useHabits } from "../data/habits";
import { colors } from "../theme";

export default function SettingsScreen() {
  const { data, setAppearance, setNotifications } = useHabits();
  const generalInfo = (page: string) =>
    router.push({ pathname: "/info", params: { page } });
  return (
    <Page>
      <Heading
        title="Settings"
        right={
          <MaterialCommunityIcons
            name="dots-vertical"
            size={20}
            color={colors.ink}
          />
        }
      />
      <Text
        style={{
          color: colors.muted,
          fontSize: 10,
          fontWeight: "800",
          marginBottom: -8,
        }}
      >
        GENERAL
      </Text>
      <Card style={{ paddingVertical: 4 }}>
        <RowItem
          icon="weather-night"
          title="Appearance"
          value={data.appearance}
          onPress={() =>
            setAppearance(data.appearance === "Light" ? "Dark" : "Light")
          }
        />
        <RowItem
          icon="bell-outline"
          title="Notifications"
          trailing={
            <Switch
              value={data.notifications}
              onValueChange={setNotifications}
              trackColor={{ false: "#D8E1E0", true: "#72C5A8" }}
              thumbColor={data.notifications ? colors.green : "#FFFFFF"}
            />
          }
        />
        <RowItem
          icon="translate"
          title="Language"
          value="English"
          onPress={() => generalInfo("Language")}
        />
      </Card>
      <Text
        style={{
          color: colors.muted,
          fontSize: 10,
          fontWeight: "800",
          marginBottom: -8,
        }}
      >
        ACCOUNT
      </Text>
      <Card style={{ paddingVertical: 4 }}>
        <RowItem
          icon="shield-lock-outline"
          title="Privacy"
          onPress={() => generalInfo("Privacy")}
        />
        <RowItem
          icon="lock-outline"
          title="Security"
          onPress={() => generalInfo("Security")}
        />
        <RowItem
          icon="delete-outline"
          title="Delete Account"
          onPress={() => generalInfo("Delete Account")}
        />
      </Card>
      <Text style={{ color: colors.faint, fontSize: 10, lineHeight: 16 }}>
        This app stores habits on this device only. Account options are
        informational and do not connect to a server.
      </Text>
    </Page>
  );
}
