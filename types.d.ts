import type { ComponentProps } from "react";

declare global {
  interface TabIconProps {
    focused: boolean;
    icon: ComponentProps<typeof Ionicons>["name"];
  }
}

export { };

