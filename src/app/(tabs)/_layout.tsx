import { Tabs as TabsData } from "@/constants/data";
import Icon from "@/constants/Icon";
import clsx from "clsx";
import { Tabs } from "expo-router";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const TabIcon = ({ focused, icon, type }: TabIconProps) => {
    return (
      <View
        className={clsx(
          "rounded-full w-12 h-12 mb-2 flex justify-center items-center",
          focused ? "bg-white" : "bg-transparent",
        )}
      >
        <Icon
          name={icon}
          type={type}
          size={focused ? 28 : 24}
          color={focused ? "#14B8A6" : "white"}
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
          bottom: Math.max(insets.bottom, 0),
          height: 60,
          borderRadius: 35,
          marginHorizontal: 20,
          backgroundColor: "#14B8A6",
        },
        tabBarItemStyle: {
          paddingVertical: Math.max(insets.bottom, 0) / 2 - 2,
        },
      }}
    >
      {TabsData.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ focused }) => (
              <TabIcon type={tab.type} focused={focused} icon={tab.icon} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
