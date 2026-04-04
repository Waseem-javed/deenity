import { HomeMenu } from "@/constants/data";
import Icon from "@/constants/Icon";
import { SafeAreaView } from "@/utils/index";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

const OtherList = () => {
  const featuredItems = HomeMenu.filter(
    (item) => item.name !== "Other" && !item.href,
  );
  const quickAccessItems = HomeMenu.filter(
    (item) => item.name !== "Other" && item.href,
  );

  return (
    <SafeAreaView className="flex-1 bg-[#F6FBFA]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
      >
        <View className="rounded-[30px] bg-[#1E293B] px-5 pb-6 pt-5">
          <View className="flex-row items-center justify-between">
            <TouchableOpacity
              onPress={() => router.back()}
              className="h-11 w-11 items-center justify-center rounded-full bg-white/10"
            >
              <Ionicons name="arrow-back" size={22} color="white" />
            </TouchableOpacity>
            <View className="rounded-full bg-white/10 px-4 py-2">
              <Text className="text-xs font-semibold uppercase tracking-[1px] text-white">
                Islamic Tools
              </Text>
            </View>
          </View>

          <Text className="mt-5 text-3xl font-bold text-white">Other</Text>
          <Text className="mt-2 text-sm leading-6 text-slate-300">
            A complete place for the rest of the Deenity modules, including
            upcoming worship, learning, and remembrance tools.
          </Text>
        </View>

        <View className="-mt-4 rounded-[28px] bg-white p-5 shadow-sm">
          <Text className="text-xs font-semibold uppercase tracking-[1px] text-slate-500">
            Quick access
          </Text>
          <View className="mt-4 gap-3">
            {quickAccessItems.map((item) => (
              <TouchableOpacity
                key={item.name}
                activeOpacity={0.85}
                onPress={() => item.href && router.push(item.href as never)}
                className="flex-row items-center rounded-[24px] bg-slate-50 px-4 py-4"
              >
                <View className="rounded-2xl bg-white p-3">
                  <Icon
                    type={item.type}
                    name={item.icon}
                    size={24}
                    color={item.accent || "#14B8A6"}
                  />
                </View>
                <View className="ml-4 flex-1">
                  <Text className="text-base font-bold text-slate-900">
                    {item.name}
                  </Text>
                  <Text className="mt-1 text-sm text-slate-500">
                    {item.description}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View className="mt-6">
          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-lg font-bold text-slate-900">
              Coming soon
            </Text>
            <Text className="text-xs font-semibold uppercase tracking-[0.8px] text-slate-400">
              Planned modules
            </Text>
          </View>

          <View className="gap-3">
            {featuredItems.map((item) => (
              <View
                key={item.name}
                className="rounded-[28px] border border-slate-100 bg-white px-4 py-4 shadow-sm"
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-1 flex-row items-center">
                    <View className="rounded-[20px] bg-slate-50 p-3">
                      <Icon
                        type={item.type}
                        name={item.icon}
                        size={24}
                        color={item.accent || "#64748B"}
                      />
                    </View>
                    <View className="ml-4 flex-1">
                      <Text className="text-base font-bold text-slate-900">
                        {item.name}
                      </Text>
                      <Text className="mt-1 text-sm leading-6 text-slate-500">
                        {item.description}
                      </Text>
                    </View>
                  </View>

                  <View className="rounded-full bg-slate-900 px-3 py-1.5">
                    <Text className="text-[11px] font-semibold uppercase tracking-[0.8px] text-white">
                      Soon
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default OtherList;
