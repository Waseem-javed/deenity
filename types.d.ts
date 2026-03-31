import type { ComponentProps } from "react";

declare global {
  interface TabIconProps {
    type: string;
    focused: boolean;
    icon: ComponentProps<typeof Ionicons>["name"];
  }
}

export { };

