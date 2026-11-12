import { File } from "expo-file-system";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { regionLabel } from "../lib/labels";
import type { AnalysisSettings } from "../lib/settings";
import { abroadRegions, type ProfileInput } from "../lib/types";
import { colors } from "./theme";

type ProfileFormProps = {
  profile: ProfileInput;
  settings: AnalysisSettings;
  submitting: boolean;
  error: string | null;
  onChange: (profile: ProfileInput) => void;
  onSettings: (settings: AnalysisSettings) => void;
  onSubmit: (profile: ProfileInput) => void;
  onExample: () => void;
};

function withSkills(base: ProfileInput, raw: string): ProfileInput {
  const incoming = raw
    .split(",")
    .map((part) => part.trim().slice(0, 40))
    .filter(Boolean);
  if (incoming.length === 0) return base;

  const seen = new Set(base.skills.map((skill) => skill.toLocaleLowerCase("fr")));
  const skills = [...base.skills];
  for (const skill of incoming) {
    const key = skill.toLocaleLowerCase("fr");
    if (seen.has(key) || skills.length >= 20) continue;
    seen.add(key);
    skills.push(skill);
  }
  return { ...base, skills };
}

export function ProfileForm({
  profile,
  settings,
  submitting,
  error,
  onChange,
  onSettings,
  onSubmit,
  onExample,
}: ProfileFormProps) {
  const [skillDraft, setSkillDraft] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [keyOpen, setKeyOpen] = useState(settings.apiKey.length === 0);
  const [localError, setLocalError] = useState<string | null>(null);

  function update(patch: Partial<ProfileInput>) {
    onChange({ ...profile, ...patch });
  }

  function addSkills(raw: string) {
    const next = withSkills(profile, raw);
    if (next !== profile) onChange(next);
    setSkillDraft("");
  }

  async function importText() {
    setLocalError(null);
    try {
      const picked = await File.pickFileAsync({ mimeTypes: ["text/plain"] });
      if (picked.canceled || !picked.result) return;
      const bytes = await picked.result.arrayBuffer();
      if (bytes.byteLength > 5 * 1024 * 1024) {
        setLocalError("Le fichier dépasse 5 Mo.");
        return;
      }
      const text = new TextDecoder().decode(bytes).trim();
      if (!text) {
        setLocalError("Ce fichier est vide.");
        return;
      }
      const cvText = [profile.cvText.trim(), text].filter(Boolean).join("\n\n").slice(0, 20000);
      onChange({ ...profile, cvText });
      setFileName(picked.result.name);
    } catch {
      setLocalError("Impossible d'ouvrir ce fichier. Collez le texte du CV.");
    }
  }

  const shownError = localError ?? error;

  return (
    <View style={styles.form}>
      <Text style={styles.kicker}>Carrière</Text>
      <Text style={styles.title}>On ne vous paye pas à votre valeur.</Text>
      <Text style={styles.lead}>
        Indiquez ce que vous savez faire, collez votre CV, et choisissez la France ou
        l&apos;étranger.
      </Text>

      <Text style={styles.label}>Compétences</Text>
      <Text style={styles.hint}>Vingt maximum. La virgule sépare les pastilles.</Text>
      {profile.skills.length > 0 ? (
        <View style={styles.wrap}>
          {profile.skills.map((skill) => (
            <Pressable
              key={skill}
              onPress={() =>
                update({ skills: profile.skills.filter((item) => item !== skill) })
              }
              style={styles.chip}
              accessibilityRole="button"
              accessibilityLabel={`Retirer ${skill}`}
            >
              <Text style={styles.chipText}>
                {skill} ×
              </Text>
            </Pressable>
          ))}
        </View>
      ) : null}
      <View style={styles.row}>
        <TextInput
          value={skillDraft}
          onChangeText={(value) => {
            if (value.includes(",")) {
              addSkills(value);
              return;
            }
            setSkillDraft(value);
          }}
          onSubmitEditing={() => addSkills(skillDraft)}
          placeholder="Rédaction, SQL, anglais"
          placeholderTextColor={colors.muted}
          autoCorrect={false}
          style={[styles.input, styles.flex]}
        />
        <Pressable onPress={() => addSkills(skillDraft)} style={styles.secondary}>
          <Text style={styles.secondaryText}>Ajouter</Text>
        </Pressable>
      </View>

      <Text style={styles.label}>CV</Text>
      <TextInput
        value={profile.cvText}
        onChangeText={(cvText) => update({ cvText })}
        placeholder="Expériences, formation, ce que vous savez faire."
        placeholderTextColor={colors.muted}
        multiline
        textAlignVertical="top"
        style={[styles.input, styles.cv]}
      />
      <Pressable onPress={() => void importText()} style={styles.secondaryWide}>
        <Text style={styles.secondaryText}>
          {fileName ? fileName : "Importer un fichier texte"}
        </Text>
      </Pressable>

      <Text style={styles.label}>Où chercher</Text>
      <View style={styles.stack}>
        <Pressable
          onPress={() => update({ zone: "france" })}
          style={[styles.zone, profile.zone === "france" && styles.zoneOn]}
          accessibilityRole="button"
          accessibilityState={{ selected: profile.zone === "france" }}
        >
          <Text style={[styles.zoneTitle, profile.zone === "france" && styles.onInk]}>
            France
          </Text>
          <Text style={[styles.zoneBody, profile.zone === "france" && styles.onMuted]}>
            France Travail, Welcome to the Jungle, LinkedIn
          </Text>
        </Pressable>
        <Pressable
          onPress={() => update({ zone: "abroad" })}
          style={[styles.zone, profile.zone === "abroad" && styles.zoneOn]}
          accessibilityRole="button"
          accessibilityState={{ selected: profile.zone === "abroad" }}
        >
          <Text style={[styles.zoneTitle, profile.zone === "abroad" && styles.onInk]}>
            À l&apos;étranger
          </Text>
          <Text style={[styles.zoneBody, profile.zone === "abroad" && styles.onMuted]}>
            Welcome to the Jungle, LinkedIn, Indeed
          </Text>
        </Pressable>
      </View>

      {profile.zone === "abroad" ? (
        <View style={styles.wrap}>
          {abroadRegions.map((region) => {
            const selected = profile.abroadRegion === region;
            return (
              <Pressable
                key={region}
                onPress={() => update({ abroadRegion: region })}
                style={[styles.pill, selected && styles.pillOn]}
              >
                <Text style={[styles.pillText, selected && styles.onInk]}>
                  {regionLabel(region)}
                </Text>
              </Pressable>
            );
          })}
        </View>
      ) : null}

      {profile.zone === "abroad" && profile.abroadRegion === "custom" ? (
        <TextInput
          value={profile.customCountry}
          onChangeText={(customCountry) => update({ customCountry })}
          placeholder="Pays, par exemple Canada"
          placeholderTextColor={colors.muted}
          style={styles.input}
        />
      ) : null}

      <Text style={styles.label}>Ville, optionnel</Text>
      <Text style={styles.hint}>Sert à affiner LinkedIn, et Indeed à l&apos;étranger.</Text>
      <TextInput
        value={profile.city}
        onChangeText={(city) => update({ city })}
        placeholder="Lyon"
        placeholderTextColor={colors.muted}
        style={styles.input}
      />

      <Text style={styles.label}>Ce que vous voulez</Text>
      <View style={styles.wrap}>
        {(
          [
            ["pay", "Mieux payé"],
            ["interest", "Plus intéressant"],
            ["both", "Les deux"],
          ] as const
        ).map(([goal, label]) => {
          const selected = profile.goal === goal;
          return (
            <Pressable
              key={goal}
              onPress={() => update({ goal })}
              style={[styles.pill, selected && styles.pillOn]}
            >
              <Text style={[styles.pillText, selected && styles.onInk]}>{label}</Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.label}>Contrat</Text>
      <View style={styles.wrap}>
        {(
          [
            ["cdi", "CDI"],
            ["freelance", "Freelance"],
            ["either", "Indifférent"],
          ] as const
        ).map(([contract, label]) => {
          const selected = profile.contract === contract;
          return (
            <Pressable
              key={contract}
              onPress={() => update({ contract })}
              style={[styles.pill, selected && styles.pillOn]}
            >
              <Text style={[styles.pillText, selected && styles.onInk]}>{label}</Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.label}>Salaire actuel, optionnel</Text>
      <Text style={styles.hint}>Brut annuel. Sert seulement à comparer les fourchettes.</Text>
      <TextInput
        value={profile.currentSalary == null ? "" : String(profile.currentSalary)}
        onChangeText={(value) => {
          const digits = value.replace(/[^\d]/g, "");
          update({ currentSalary: digits ? Number(digits) : null });
        }}
        placeholder="34000"
        placeholderTextColor={colors.muted}
        keyboardType="number-pad"
        style={styles.input}
      />

      <Pressable onPress={() => setKeyOpen((open) => !open)} style={styles.keyToggle}>
        <Text style={styles.label}>Clé d&apos;analyse</Text>
        <Text style={styles.hint}>{keyOpen ? "Masquer" : settings.apiKey ? "Enregistrée" : "À ajouter"}</Text>
      </Pressable>
      {keyOpen ? (
        <View style={styles.stack}>
          <Text style={styles.hint}>
            Elle reste sur cet iPhone. OpenAI, ou une adresse compatible.
          </Text>
          <TextInput
            value={settings.apiKey}
            onChangeText={(apiKey) => onSettings({ ...settings, apiKey })}
            placeholder="Clé API"
            placeholderTextColor={colors.muted}
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry
            style={styles.input}
          />
          <TextInput
            value={settings.model}
            onChangeText={(model) => onSettings({ ...settings, model })}
            placeholder="Modèle, par exemple gpt-4o-mini"
            placeholderTextColor={colors.muted}
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.input}
          />
          <TextInput
            value={settings.baseURL}
            onChangeText={(baseURL) => onSettings({ ...settings, baseURL })}
            placeholder="https://api.openai.com/v1"
            placeholderTextColor={colors.muted}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
            style={styles.input}
          />
        </View>
      ) : null}

      {shownError ? (
        <Text accessibilityRole="alert" style={styles.error}>
          {shownError}
        </Text>
      ) : null}

      <Pressable
        disabled={submitting}
        onPress={() => {
          const next = withSkills(profile, skillDraft);
          setSkillDraft("");
          if (next !== profile) onChange(next);
          onSubmit(next);
        }}
        style={[styles.primary, submitting && styles.disabled]}
      >
        {submitting ? (
          <ActivityIndicator color={colors.accentInk} />
        ) : (
          <Text style={styles.primaryText}>Trouver mes pistes</Text>
        )}
      </Pressable>
      <Pressable
        disabled={submitting}
        onPress={onExample}
        style={[styles.secondaryWide, submitting && styles.disabled]}
      >
        <Text style={styles.secondaryText}>Voir un exemple</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: 12,
    paddingBottom: 32,
  },
  kicker: {
    color: colors.muted,
    fontSize: 13,
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
  title: {
    color: colors.ink,
    fontSize: 34,
    fontWeight: "700",
    letterSpacing: -0.6,
    lineHeight: 40,
  },
  lead: {
    color: colors.muted,
    fontSize: 17,
    lineHeight: 24,
    marginBottom: 8,
  },
  label: {
    color: colors.ink,
    fontSize: 17,
    fontWeight: "600",
    marginTop: 8,
  },
  hint: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  input: {
    backgroundColor: colors.raised,
    borderColor: colors.line,
    borderRadius: 14,
    borderWidth: 1,
    color: colors.ink,
    fontSize: 17,
    minHeight: 48,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  cv: {
    minHeight: 160,
  },
  flex: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
    gap: 8,
  },
  wrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  stack: {
    gap: 8,
  },
  chip: {
    backgroundColor: colors.ink,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chipText: {
    color: colors.paper,
    fontSize: 15,
  },
  pill: {
    backgroundColor: colors.raised,
    borderColor: colors.line,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  pillOn: {
    backgroundColor: colors.ink,
    borderColor: colors.ink,
  },
  pillText: {
    color: colors.ink,
    fontSize: 15,
  },
  zone: {
    backgroundColor: colors.raised,
    borderColor: colors.line,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  zoneOn: {
    backgroundColor: colors.ink,
    borderColor: colors.ink,
  },
  zoneTitle: {
    color: colors.ink,
    fontSize: 17,
    fontWeight: "600",
  },
  zoneBody: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
  },
  onInk: {
    color: colors.paper,
  },
  onMuted: {
    color: "#EADFCE",
  },
  keyToggle: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  error: {
    backgroundColor: colors.errorBg,
    borderRadius: 14,
    color: colors.accent,
    fontSize: 15,
    lineHeight: 21,
    padding: 14,
  },
  primary: {
    alignItems: "center",
    backgroundColor: colors.accent,
    borderRadius: 14,
    justifyContent: "center",
    minHeight: 52,
    marginTop: 8,
  },
  primaryText: {
    color: colors.accentInk,
    fontSize: 17,
    fontWeight: "600",
  },
  secondary: {
    alignItems: "center",
    backgroundColor: colors.raised,
    borderColor: colors.line,
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: "center",
    paddingHorizontal: 14,
  },
  secondaryWide: {
    alignItems: "center",
    backgroundColor: colors.raised,
    borderColor: colors.line,
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: "center",
    minHeight: 48,
    paddingHorizontal: 14,
  },
  secondaryText: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: "500",
  },
  disabled: {
    opacity: 0.6,
  },
});
