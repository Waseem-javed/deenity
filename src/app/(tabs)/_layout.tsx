import { Tabs as TabsData } from "@/constants/data";
import Ionicons from "@expo/vector-icons/Ionicons";
import clsx from "clsx";
import { Tabs } from "expo-router";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const TabIcon = ({ focused, icon }: TabIconProps) => {
    return (
      <View
        className={clsx(
          "rounded-full flex justify-center items-center w-16 h-16",
          focused ? "bg-blue-100 border-4 border-blue-100" : "bg-transparent",
        )}
      >
        <Ionicons
          name={icon}
          size={focused ? 30 : 20}
          color={focused ? "#007AFF" : "#8E8E93"}
        />
      </View>
    );
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          bottom: Math.max(insets.bottom, 8),
          height: 70,
          borderRadius: 35,
          marginHorizontal: 20,
        },
        tabBarItemStyle: {
          paddingVertical: Math.max(insets.bottom, 10) / 2 - 2,
        },
        tabBarIconStyle: {},
      }}
    >
      {TabsData.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ focused }) => (
              <TabIcon focused={focused} icon={tab.icon} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
