import type { ReactNode } from "react";
import { Text, View } from "react-native";
import { ActivityIndicator, Button } from "react-native-paper";

type AsyncStateProps = {
  loading: boolean;
  error?: string | null;
  onRetry?: () => void;
  children: ReactNode;
};

export function AsyncState({ loading, error, onRetry, children }: AsyncStateProps) {
  if (loading) {
    return (
      <View className="flex-1 items-center justify-center py-16">
        <ActivityIndicator size="large" color="#0f8478" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center gap-3 py-16 px-6">
        <Text className="text-center text-base text-slate-600 dark:text-slate-300">{error}</Text>
        {onRetry ? (
          <Button mode="outlined" onPress={onRetry} icon="refresh">
            Try again
          </Button>
        ) : null}
      </View>
    );
  }

  return <>{children}</>;
}
