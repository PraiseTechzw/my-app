import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { Card, Heading, Page, RowItem } from "../../components/ui";
import { useHabits } from "../../data/habits";
import { colors } from "../../theme";

export default function ProfileScreen() {
  const { data } = useHabits();
  return (
    <Page>
      <Heading title="Profile" />
      <Pressable onPress={() => router.push("/profile-edit")} accessibilityRole="button" accessibilityLabel="Edit your local profile name" style={{ alignItems: "center", gap: 8, paddingVertical: 14 }}>
        <View style={{ width: 76, height: 76, borderRadius: 38, backgroundColor: "#DAEEE7", alignItems: "center", justifyContent: "center" }}>
          <Text style={{ color: colors.greenDark, fontSize: 28, fontWeight: "800" }}>{data.profileName.slice(0, 1).toUpperCase()}</Text>
          <View style={{ position: "absolute", bottom: 0, right: 0, width: 22, height: 22, borderRadius: 11, backgroundColor: colors.green, borderWidth: 2, borderColor: colors.canvas, alignItems: "center", justifyContent: "center" }}><MaterialCommunityIcons name="pencil" size={11} color={colors.white} /></View>
        </View>
        <Text style={{ color: colors.ink, fontSize: 17, fontWeight: "800" }}>{data.profileName}</Text>
        <Text style={{ color: colors.muted, fontSize: 11 }}>Personal profile · stored on this device</Text>
      </Pressable>
      <Card style={{ paddingVertical: 4 }}>
        <RowItem icon="target" title="My Goals" onPress={() => router.push("/goals")} />
        <RowItem icon="bell-outline" title="Notifications" value={data.notifications ? "On" : "Off"} onPress={() => router.push("/settings")} />
        <RowItem icon="weather-night" title="Appearance" value="Light" onPress={() => router.push("/settings")} />
        <RowItem icon="cog-outline" title="Settings" onPress={() => router.push("/settings")} />
        <RowItem icon="help-circle-outline" title="Help & Support" onPress={() => router.push({ pathname: "/info", params: { page: "Help & Support" } })} />
      </Card>
      <Text style={{ color: colors.faint, fontSize: 10, textAlign: "center" }}>FocusFlow · Version 1.0 · Your data stays on this device</Text>
    </Page>
  );
}
