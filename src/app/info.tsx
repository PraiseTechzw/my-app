import { router, useLocalSearchParams } from "expo-router";
import { Text } from "react-native";
import { Card, Heading, Page } from "../components/ui";
import { colors } from "../theme";

export default function InfoScreen() {
  const { page } = useLocalSearchParams<{ page: string }>();
  return (
    <Page>
      <Heading title={page ?? "Information"} />
      <Card>
        <Text style={{ color: colors.ink, fontSize: 13, lineHeight: 20 }}>
          {page === "Log Out"
            ? "There is no signed-in account for this local-only app."
            : `${page ?? "This section"} is kept on this device. No account or remote service is connected.`}
        </Text>
      </Card>
      <Text
        onPress={() => router.back()}
        style={{ color: colors.green, fontSize: 12, fontWeight: "700" }}
      >
        Go back
      </Text>
    </Page>
  );
}
