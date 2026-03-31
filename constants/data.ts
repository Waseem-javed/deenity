import {
    AntDesign,
    Entypo,
    EvilIcons,
    Feather,
    FontAwesome,
    FontAwesome5,
    FontAwesome6,
    Fontisto,
    Foundation,
    Ionicons,
    MaterialCommunityIcons,
    MaterialIcons,
    Octicons,
    SimpleLineIcons,
    Zocial,
} from "@expo/vector-icons";

export const Tabs = [
  { name: "index", title: "Home", type: "Ionicons", icon: "home-outline" },
  {
    name: "Finders",
    title: "Mosque Finder",
    type: "MaterialCommunityIcons",
    icon: "compass-rose",
  },
  {
    name: "Prayers",
    title: "Prayer Times",
    type: "MaterialCommunityIcons",
    icon: "hands-pray",
  },
  { name: "Settings", title: "Settings", type: "Ionicons", icon: "settings" },
];

export const HomeMenu = [
  { name: "Kalma", icon: "book", type: "Material" },
  { name: "Adhaan", icon: "modern-mic", type: "Entypo" },
  {
    name: "Al Qur'an",
    icon: "book-open-variant",
    type: "MaterialCommunityIcons",
  },
  { name: "Al Hadith", icon: "bookmark", type: "Material" },
  { name: "Asma Ul Husna", icon: "star", type: "Material" },
  { name: "Tasbih", icon: "counter", type: "MaterialCommunityIcons" },
  { name: "Qibla", icon: "compass", type: "MaterialCommunityIcons" },
  { name: "Siyam", icon: "moon", type: "Entypo" },
  { name: "Dua", icon: "hands-pray", type: "MaterialCommunityIcons" },
  { name: "Hajj & Umrah", icon: "map", type: "Material" },
  { name: "99 Names", icon: "99", type: "Material" },
  { name: "Other", icon: "apps", type: "Material" },
];

export const GetIconType = (name: string) => {
  switch (name.trim()) {
    case "Ionicons":
      return Ionicons;
    case "MaterialCommunityIcons":
      return MaterialCommunityIcons;
    case "Entypo":
      return Entypo;
    case "Material":
      return MaterialIcons;
    case "AntDesign":
      return AntDesign;
    case "EvilIcons":
      return EvilIcons;
    case "Feather":
      return Feather;
    case "FontAwesome":
      return FontAwesome;
    case "FontAwesome5":
      return FontAwesome5;
    case "FontAwesome6":
      return FontAwesome6;
    case "Fontisto":
      return Fontisto;
    case "Foundation":
      return Foundation;
    case "Octicons":
      return Octicons;
    case "SimpleLineIcons":
      return SimpleLineIcons;
    case "Zocial":
      return Zocial;
    default:
      return name;
  }
};
