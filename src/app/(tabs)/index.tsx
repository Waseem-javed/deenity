import { SafeAreaView } from "@/utils/index";
import { Link } from "expo-router";
import { Text } from "react-native";

export default function Index() {
  return (
    <SafeAreaView className="flex-1 justify-center items-center bg-sky-200">
      <Text className="text-lg text-blue-500">Home</Text>
      <Link className="bg-blue-600 p-1" href="/onBoarding">
        Go to OnBoarding
      </Link>
      <Link className="bg-blue-600 p-1" href="/(auth)/signin">
        Go to Sign In
      </Link>
      <Link className="bg-blue-600 p-1" href="/(auth)/signup">
        Go to Sign Up
      </Link>
    </SafeAreaView>
  );
}
