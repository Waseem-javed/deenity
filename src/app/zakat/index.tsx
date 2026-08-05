import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { Button, TextInput } from "react-native-paper";

import { ScreenContainer } from "@/components/ui/ScreenContainer";
import { ZakatService } from "@/services/ummah/zakat";

type FieldKey = "cash" | "gold_grams" | "gold_price_per_gram" | "silver_grams" | "silver_price_per_gram" | "liabilities";

function AmountField({
  label,
  icon,
  value,
  onChangeText,
}: {
  label: string;
  icon: string;
  value: string;
  onChangeText: (text: string) => void;
}) {
  return (
    <TextInput
      mode="outlined"
      label={label}
      keyboardType="numeric"
      value={value}
      onChangeText={onChangeText}
      left={<TextInput.Icon icon={icon} />}
      style={{ flex: 1 }}
    />
  );
}

function Section({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <View className="rounded-2xl bg-white/70 dark:bg-white/10 border border-white/60 dark:border-white/10 p-4">
      <Text className="text-base font-semibold text-slate-900 dark:text-white">{title}</Text>
      <Text className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{subtitle}</Text>
      <View className="mt-3 gap-3">{children}</View>
    </View>
  );
}

export default function ZakatScreen() {
  const [values, setValues] = useState<Record<FieldKey, string>>({} as Record<FieldKey, string>);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    dueFormatted: string;
    aboveNisab: boolean;
    note: string;
    rate: string;
    grossWealth: number;
    netZakatableWealth: number;
  } | null>(null);

  function setField(key: FieldKey, text: string) {
    setValues((prev) => ({ ...prev, [key]: text }));
  }

  async function calculate() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const goldPricePerGram = Number(values.gold_price_per_gram) || 0;
      const response = await ZakatService.zakatCalculate({
        gold_price_per_gram: goldPricePerGram,
        silver_price_per_gram: Number(values.silver_price_per_gram) || undefined,
        cash: Number(values.cash) || undefined,
        gold_grams: Number(values.gold_grams) || undefined,
        silver_grams: Number(values.silver_grams) || undefined,
        liabilities: Number(values.liabilities) || undefined,
      });
      const data = response.data?.data ?? {};
      setResult({
        dueFormatted: data.zakat_due_formatted ?? String(data.zakat_due ?? 0),
        aboveNisab: Boolean(data.above_nisab),
        note: data.note ?? "",
        rate: data.rate ?? "2.5%",
        grossWealth: data.breakdown?.gross_wealth ?? 0,
        netZakatableWealth: data.breakdown?.net_zakatable_wealth ?? 0,
      });
    } catch {
      setError("Couldn't calculate Zakat right now.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScreenContainer className="px-0 py-0" edges={["left", "right", "bottom"]}>
      <ScrollView contentContainerClassName="px-6 pt-4 pb-6 gap-3" keyboardShouldPersistTaps="handled">
        <Text className="mb-1 text-base text-slate-600 dark:text-slate-300">Fill in what applies to you — leave the rest blank</Text>

        <Section title="Cash & Savings" subtitle="Bank balances, cash on hand">
          <AmountField label="Cash & bank savings" icon="cash" value={values.cash ?? ""} onChangeText={(t) => setField("cash", t)} />
        </Section>

        <Section title="Gold" subtitle="Owned gold, valued at today's price">
          <View className="flex-row gap-3">
            <AmountField label="Grams owned" icon="gold" value={values.gold_grams ?? ""} onChangeText={(t) => setField("gold_grams", t)} />
            <AmountField
              label="Price / gram"
              icon="currency-usd"
              value={values.gold_price_per_gram ?? ""}
              onChangeText={(t) => setField("gold_price_per_gram", t)}
            />
          </View>
        </Section>

        <Section title="Silver" subtitle="Owned silver, valued at today's price">
          <View className="flex-row gap-3">
            <AmountField
              label="Grams owned"
              icon="circle-outline"
              value={values.silver_grams ?? ""}
              onChangeText={(t) => setField("silver_grams", t)}
            />
            <AmountField
              label="Price / gram"
              icon="currency-usd"
              value={values.silver_price_per_gram ?? ""}
              onChangeText={(t) => setField("silver_price_per_gram", t)}
            />
          </View>
        </Section>

        <Section title="Liabilities" subtitle="Debts due, deducted from your total">
          <AmountField
            label="Outstanding liabilities"
            icon="credit-card-minus-outline"
            value={values.liabilities ?? ""}
            onChangeText={(t) => setField("liabilities", t)}
          />
        </Section>

        <Button mode="contained" onPress={calculate} loading={loading} disabled={loading} style={{ marginTop: 8 }} icon="calculator-variant-outline">
          Calculate Zakat
        </Button>

        {error ? <Text className="text-center text-base text-slate-600 dark:text-slate-300">{error}</Text> : null}

        {result !== null ? (
          <View className="mt-2 rounded-2xl bg-brand-50 dark:bg-brand-400/10 p-6">
            <View className="items-center">
              <Text className="text-sm font-medium text-brand-600 dark:text-brand-400">{result.aboveNisab ? "Zakat due" : "Below nisab"}</Text>
              <Text className="mt-1 text-3xl font-semibold text-slate-900 dark:text-white">{result.dueFormatted}</Text>
              {result.note ? <Text className="mt-2 text-center text-sm text-slate-500 dark:text-slate-400">{result.note}</Text> : null}
            </View>

            {result.aboveNisab ? (
              <View className="mt-4 flex-row justify-between border-t border-brand-100 pt-4 dark:border-white/10">
                <View>
                  <Text className="text-xs text-slate-500 dark:text-slate-400">Net zakatable wealth</Text>
                  <Text className="mt-0.5 text-base font-medium text-slate-900 dark:text-white">{result.netZakatableWealth.toLocaleString()}</Text>
                </View>
                <View className="items-end">
                  <Text className="text-xs text-slate-500 dark:text-slate-400">Rate</Text>
                  <Text className="mt-0.5 text-base font-medium text-slate-900 dark:text-white">{result.rate}</Text>
                </View>
              </View>
            ) : null}
          </View>
        ) : null}
      </ScrollView>
    </ScreenContainer>
  );
}
