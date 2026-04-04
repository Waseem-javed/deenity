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
  {
    name: "Kalma",
    icon: "book",
    type: "Material",
    description: "Six essential declarations for daily remembrance",
    accent: "#F59E0B",
  },
  {
    name: "Adhaan",
    icon: "modern-mic",
    type: "Entypo",
    href: "/(tabs)/Prayers",
    description: "Prayer times, alerts, and adhan controls",
    accent: "#14B8A6",
  },
  {
    name: "Al Qur'an",
    icon: "book-open-variant",
    type: "MaterialCommunityIcons",
    href: "/quran",
    description: "Read every surah with Arabic text and translation",
    accent: "#0F766E",
  },
  {
    name: "Al Hadith",
    icon: "bookmark",
    type: "Material",
    description: "Prophetic sayings and collections",
    accent: "#8B5CF6",
  },
  {
    name: "Asma Ul Husna",
    icon: "star",
    type: "Material",
    description: "Beautiful names of Allah with meanings",
    accent: "#EC4899",
  },
  {
    name: "Tasbih",
    icon: "counter",
    type: "MaterialCommunityIcons",
    description: "Digital dhikr counter for tasbeeh",
    accent: "#22C55E",
  },
  {
    name: "Qibla",
    icon: "compass",
    type: "MaterialCommunityIcons",
    href: "/(tabs)/Finders",
    description: "Live compass to face the Kaaba accurately",
    accent: "#3B82F6",
  },
  {
    name: "Siyam",
    icon: "moon",
    type: "Entypo",
    description: "Fasting intentions, sehri, and iftar support",
    accent: "#6366F1",
  },
  {
    name: "Dua",
    icon: "hands-pray",
    type: "MaterialCommunityIcons",
    description: "Supplications for daily life and worship",
    accent: "#F97316",
  },
  {
    name: "Hajj & Umrah",
    icon: "map",
    type: "Material",
    description: "Pilgrimage guidance and rituals",
    accent: "#EF4444",
  },
  {
    name: "99 Names",
    icon: "99",
    type: "Material",
    description: "Memorize and reflect on the ninety-nine names",
    accent: "#10B981",
  },
  {
    name: "Other",
    icon: "apps",
    type: "Material",
    href: "/others",
    description: "Open the complete Islamic tools collection",
    accent: "#334155",
  },
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
