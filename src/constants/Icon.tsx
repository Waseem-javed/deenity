import React from "react";
import { Text } from "react-native";
import { GetIconType } from "./data";

const Icon = ({
  name,
  type,
  size = 22,
  color,
}: {
  name: string;
  type: string;
  size?: number;
  color?: string;
}) => {
  const IconComponent = GetIconType(type) as any;
  const glyphMap = IconComponent?.glyphMap;
  const hasIcon =
    glyphMap && Object.prototype.hasOwnProperty.call(glyphMap, name);

  if (!IconComponent || !hasIcon) {
    return <Text className={`font-bold p-1 text-[${color}]`}>{name}</Text>;
  }

  return <IconComponent name={name} size={size} color={color || "#000"} />;
};

export default Icon;
