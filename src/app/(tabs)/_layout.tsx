import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs, router } from "expo-router";
import { Pressable, View } from "react-native";
import { colors } from "../../theme";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.green,
        tabBarInactiveTintColor: "#8A9A9E",
        tabBarLabelStyle: { fontSize: 9, fontWeight: "600", marginTop: -2 },
        tabBarStyle: {
          height: 68,
          paddingTop: 7,
          paddingBottom: 8,
          borderTopColor: "#E7ECEB",
          backgroundColor: "#FFFFFF",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="home-variant-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: "Stats",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="chart-bar"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: "",
          tabBarLabel: () => null,
          tabBarButton: () => (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Add habit"
              onPress={() => router.push("/add-habit")}
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 19,
                  marginTop: -13,
                  backgroundColor: colors.green,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MaterialCommunityIcons name="plus" size={24} color="#FFFFFF" />
              </View>
            </Pressable>
          ),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: "Calendar",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="calendar-month-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="account-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Tabs>
  );
}
