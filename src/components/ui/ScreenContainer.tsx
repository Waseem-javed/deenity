import type { ReactNode } from "react";
import type { ViewProps } from "react-native";
import { View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useColorScheme } from "nativewind";
import { SafeAreaView, type Edge } from "react-native-safe-area-context";

type ScreenContainerProps = ViewProps & {
  children: ReactNode;
  className?: string;
  /** Which sides to pad for the device's safe area. Screens rendered under a tab bar
   * shouldn't add a bottom inset themselves, since the tab bar already accounts for it. */
  edges?: Edge[];
};

const LIGHT_GRADIENT = ["#f3fbf9", "#e3f4f0", "#eef2fb"] as const;
const DARK_GRADIENT = ["#03100f", "#051a19", "#040b14"] as const;

/** Every screen sits on the same soft teal gradient backdrop; content is transparent on top of it. */
export function ScreenContainer({ children, className, edges = ["top", "left", "right"], ...props }: ScreenContainerProps) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <View className="flex-1">
      <LinearGradient
        colors={isDark ? DARK_GRADIENT : LIGHT_GRADIENT}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0 }}
      />
      <SafeAreaView
        edges={edges}
        className={className ? ["flex-1 px-4", className].join(" ") : "flex-1 px-6 py-6"}
        style={[{ backgroundColor: "transparent" }, props.style]}
        {...props}
      >
        {children}
      </SafeAreaView>
    </View>
  );
}
