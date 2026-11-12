import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ProfileForm } from "./components/profile-form";
import { ResultsView } from "./components/results-view";
import { colors } from "./components/theme";
import { analyzeProfile } from "./lib/analyze";
import { buildExample, exampleProfile } from "./lib/example";
import {
  defaultSettings,
  loadSettings,
  saveSettings,
  type AnalysisSettings,
} from "./lib/settings";
import { emptyProfile, type Analysis, type ProfileInput } from "./lib/types";
import { validateProfile } from "./lib/validate";

export default function App() {
  const [ready, setReady] = useState(false);
  const [screen, setScreen] = useState<"form" | "results">("form");
  const [profile, setProfile] = useState<ProfileInput>(emptyProfile);
  const [settings, setSettings] = useState<AnalysisSettings>(defaultSettings);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSettings()
      .then(setSettings)
      .finally(() => setReady(true));
  }, []);

  async function submit(next: ProfileInput) {
    const message = validateProfile(next);
    if (message) {
      setError(message);
      return;
    }

    setProfile(next);
    setSubmitting(true);
    setError(null);
    try {
      await saveSettings(settings);
      const result = await analyzeProfile(next, settings);
      setAnalysis(result);
      setScreen("results");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "L'analyse n'a pas abouti.");
    } finally {
      setSubmitting(false);
    }
  }

  function showExample() {
    setProfile(exampleProfile);
    setError(null);
    setAnalysis(buildExample());
    setScreen("results");
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      {ready ? (
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          contentInsetAdjustmentBehavior="automatic"
        >
          {screen === "results" && analysis ? (
            <ResultsView
              analysis={analysis}
              profile={profile}
              onBack={() => setScreen("form")}
            />
          ) : (
            <ProfileForm
              profile={profile}
              settings={settings}
              submitting={submitting}
              error={error}
              onChange={setProfile}
              onSettings={setSettings}
              onSubmit={(next) => void submit(next)}
              onExample={showExample}
            />
          )}
        </ScrollView>
      ) : (
        <View style={styles.loading}>
          <ActivityIndicator color={colors.ink} />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    backgroundColor: colors.paper,
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  loading: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
});
