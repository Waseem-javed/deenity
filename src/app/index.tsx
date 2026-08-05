import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";

import { ScreenContainer } from "@/components/ui/ScreenContainer";
import { getHasOnboarded } from "@/lib/onboarding";

export default function Index() {
  const [hasOnboarded, setHasOnboarded] = useState<boolean | null>(null);

  useEffect(() => {
    getHasOnboarded().then(setHasOnboarded);
  }, []);

  if (hasOnboarded === null) {
    return (
      <ScreenContainer className="items-center justify-center">
        <ActivityIndicator size="large" color="#0f8478" />
      </ScreenContainer>
    );
  }

  return <Redirect href={hasOnboarded ? "/(tabs)" : "/onboarding"} />;
}
