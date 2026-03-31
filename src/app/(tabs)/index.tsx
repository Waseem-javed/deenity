import { HomeMenu } from "@/constants/data";
import Icon from "@/constants/Icon";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  return (
    <View className="flex-1 flex-col">
      <View className="pt-20 bg-[#14B8A6]">
        {/* HEADER */}
        <LinearGradient
          colors={["#14B8A6", "#0F9E8F"]}
          className="px-5 rounded-b-[30px]"
        >
          <View className="flex flex-row justify-between px-5">
            <Text className="text-white text-lg opacity-80">
              09 Muharram, 1444
            </Text>
            <Text className="text-white text-lg opacity-80">
              <Ionicons name="location-sharp" size={18} color="white" /> Dhaka
            </Text>
          </View>

          <View className="justify-center py-10 items-center">
            <Text className="text-white text-3xl font-bold mt-3">ISHA</Text>
            <Text className="text-white opacity-80">Current Prayer</Text>
          </View>

          {/* TIME BOXES */}
          <View className="flex-row justify-around items-center mb-30">
            <View className="items-center bg-white/10 px-6 py-6 rounded-4xl">
              <Text className="text-white font-bold text-xs">START</Text>
              <Text className="text-white font-bold text-lg">07:50 PM</Text>
            </View>

            <View className="items-center bg-white/10 px-6 py-6 rounded-4xl">
              <Text className="text-white font-bold text-xs">END</Text>
              <Text className="text-white font-bold text-lg">09:50 PM</Text>
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* CARD */}
      <View className="-mt-16 px-5">
        <View className="bg-white rounded-3xl p-5 shadow-lg">
          {/* GRID */}
          <View className="flex-row flex-wrap justify-between items-center">
            {HomeMenu.map((item, index) => (
              <TouchableOpacity
                key={index}
                className="w-[30%] items-center mb-6"
              >
                <View className="bg-[#E6F7F5] p-4 rounded-2xl">
                  <Icon
                    type={item.type}
                    name={item.icon}
                    size={28}
                    color="#14B8A6"
                  />
                </View>

                <Text className="font-sans-semibold text-xs text-center mt-2 text-gray-700">
                  {item.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}
