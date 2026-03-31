export const Icons = {
  home: "home",
  menu: "menu",
  star: "star",
  close: "close",
  heart: "heart",
  user: "person",
  search: "search",
  back: "arrow-back",
  settings: "settings",
  insights: "analytics",
  share: "share-social",
  subscriptions: "card",
} as const;

export type IconName = (typeof Icons)[keyof typeof Icons];
