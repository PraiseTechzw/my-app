import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Text, View } from "react-native";
import { Card, Heading, Page, RowItem } from "../../components/ui";
import { colors } from "../../theme";

export default function ProfileScreen() {
  return (
    <Page>
      <Heading title="Profile" />
      <View style={{ alignItems: "center", gap: 8, paddingVertical: 14 }}>
        <View
          style={{
            width: 76,
            height: 76,
            borderRadius: 38,
            backgroundColor: "#DAEEE7",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{ color: colors.greenDark, fontSize: 28, fontWeight: "800" }}
          >
            P
          </Text>
          <View
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              width: 22,
              height: 22,
              borderRadius: 11,
              backgroundColor: colors.green,
              borderWidth: 2,
              borderColor: colors.canvas,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MaterialCommunityIcons
              name="check"
              size={13}
              color={colors.white}
            />
          </View>
        </View>
        <Text style={{ color: colors.ink, fontSize: 17, fontWeight: "800" }}>
          Praise Masunga
        </Text>
        <Text style={{ color: colors.muted, fontSize: 11 }}>
          praise@example.com
        </Text>
      </View>
      <Card style={{ paddingVertical: 4 }}>
        <RowItem
          icon="target"
          title="My Goals"
          onPress={() => router.push("/goals")}
        />
        <RowItem
          icon="bell-outline"
          title="Notifications"
          onPress={() => router.push("/settings")}
        />
        <RowItem
          icon="weather-night"
          title="Appearance"
          onPress={() => router.push("/settings")}
        />
        <RowItem
          icon="help-circle-outline"
          title="Help & Support"
          onPress={() =>
            router.push({
              pathname: "/info",
              params: { page: "Help & Support" },
            })
          }
        />
        <RowItem
          icon="logout"
          title="Log Out"
          onPress={() =>
            router.push({ pathname: "/info", params: { page: "Log Out" } })
          }
        />
      </Card>
      <Text style={{ color: colors.faint, fontSize: 10, textAlign: "center" }}>
        FocusFlow · Version 1.0
      </Text>
    </Page>
  );
}
