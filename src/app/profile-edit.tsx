import { router } from "expo-router";
import { useState } from "react";
import { Text } from "react-native";
import { AppButton, AppInput, Heading, IconButton, Page } from "../components/ui";
import { useHabits } from "../data/habits";
import { colors } from "../theme";

export default function EditProfileScreen() {
  const { data, setProfileName } = useHabits();
  const [name, setName] = useState(data.profileName);
  const [error, setError] = useState("");
  const save = () => {
    if (!name.trim()) { setError("Enter a name to continue."); return; }
    setProfileName(name);
    router.back();
  };
  return <Page>
    <Heading title="Edit Profile" right={<IconButton name="close" onPress={() => router.back()} />} />
    <AppInput label="Your name" value={name} onChangeText={(value) => { setName(value); setError(""); }} placeholder="Your name" maxLength={50} returnKeyType="done" />
    {error ? <Text accessibilityRole="alert" style={{ color: colors.red, fontSize: 12 }}>{error}</Text> : null}
    <Text style={{ color: colors.muted, fontSize: 11, lineHeight: 17 }}>This name is stored on this device and is used to personalize the home screen.</Text>
    <AppButton title="Save Profile" onPress={save} />
  </Page>;
}
