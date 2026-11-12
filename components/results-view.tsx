import { Linking, Pressable, StyleSheet, Text, View } from "react-native";

import { preferenceLine } from "../lib/labels";
import { formatMoney } from "../lib/present";
import { sponsor } from "../lib/sponsors";
import type { Analysis, CareerCard, ProfileInput } from "../lib/types";
import { colors } from "./theme";

function sponsorEnabled(): boolean {
  if (!sponsor.active) return false;
  try {
    const url = new URL(sponsor.href);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function SponsorSlot() {
  const enabled = sponsorEnabled();

  return (
    <View style={styles.sponsor}>
      <Text style={styles.sponsorKicker}>{sponsor.kicker}</Text>
      <Text style={styles.sponsorTitle}>{sponsor.headline}</Text>
      <Text style={styles.sponsorBody}>{sponsor.body}</Text>
      <Pressable
        disabled={!enabled}
        onPress={() => {
          if (enabled) void Linking.openURL(sponsor.href);
        }}
        style={[styles.sponsorButton, !enabled && styles.sponsorButtonOff]}
      >
        <Text style={[styles.sponsorButtonText, !enabled && styles.sponsorButtonTextOff]}>
          {sponsor.cta}
        </Text>
      </Pressable>
    </View>
  );
}

function CareerArticle({ career, index }: { career: CareerCard; index: number }) {
  const range = `${formatMoney(career.salaryMin, career.currency)} – ${formatMoney(career.salaryMax, career.currency)}`;

  return (
    <View style={styles.card}>
      <Text style={styles.index}>{String(index + 1).padStart(2, "0")}</Text>
      <Text style={styles.cardTitle}>{career.title}</Text>
      <Text style={styles.body}>{career.why}</Text>
      <Text style={styles.gap}>
        <Text style={styles.gapLabel}>Ce qui manque. </Text>
        {career.gap}
      </Text>
      <Text style={styles.salary}>
        {range}
        <Text style={styles.salaryNote}> / an · estimation</Text>
      </Text>
      {career.gapNote ? <Text style={styles.gapNote}>{career.gapNote}</Text> : null}
      <View style={styles.links}>
        {career.links.map((link) => (
          <Pressable
            key={link.label}
            onPress={() => void Linking.openURL(link.href)}
            style={styles.link}
          >
            <Text style={styles.linkText}>{link.label}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

export function ResultsView({
  analysis,
  profile,
  onBack,
}: {
  analysis: Analysis;
  profile: ProfileInput;
  onBack: () => void;
}) {
  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.kicker}>Cinq pistes</Text>
        <Pressable onPress={onBack} hitSlop={8}>
          <Text style={styles.back}>Profil</Text>
        </Pressable>
      </View>
      <Text style={styles.title}>{analysis.profileLine}</Text>
      <Text style={styles.meta}>{preferenceLine(profile)}</Text>
      {analysis.source === "example" ? (
        <Text style={styles.notice}>
          Exemple fictif. Aucune donnée n&apos;a été envoyée.
        </Text>
      ) : null}
      {analysis.careers.map((career, index) => (
        <View key={`${career.title}-${index}`} style={styles.block}>
          <CareerArticle career={career} index={index} />
          {index === 1 ? <SponsorSlot /> : null}
        </View>
      ))}
      <Text style={styles.disclaimer}>
        Les fourchettes sont des estimations, pas une offre d&apos;emploi. Les liens ouvrent
        une recherche sur des sites externes.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    gap: 14,
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  kicker: {
    color: colors.muted,
    fontSize: 13,
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
  back: {
    color: colors.ink,
    fontSize: 17,
  },
  title: {
    color: colors.ink,
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: -0.4,
    lineHeight: 34,
  },
  meta: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 21,
  },
  notice: {
    backgroundColor: colors.raised,
    borderColor: colors.line,
    borderRadius: 14,
    borderWidth: 1,
    color: colors.muted,
    fontSize: 15,
    lineHeight: 21,
    padding: 14,
  },
  block: {
    gap: 14,
  },
  card: {
    backgroundColor: colors.raised,
    borderColor: colors.line,
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
  },
  index: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: "600",
  },
  cardTitle: {
    color: colors.ink,
    fontSize: 26,
    fontWeight: "700",
    letterSpacing: -0.3,
    marginTop: 4,
  },
  body: {
    color: colors.ink,
    fontSize: 16,
    lineHeight: 23,
    marginTop: 12,
  },
  gap: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 10,
  },
  gapLabel: {
    color: colors.ink,
    fontWeight: "600",
  },
  salary: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: "600",
    marginTop: 14,
  },
  salaryNote: {
    color: colors.muted,
    fontWeight: "400",
  },
  gapNote: {
    color: colors.accent,
    fontSize: 15,
    lineHeight: 21,
    marginTop: 8,
  },
  links: {
    gap: 8,
    marginTop: 16,
  },
  link: {
    alignSelf: "flex-start",
    borderColor: colors.line,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  linkText: {
    color: colors.ink,
    fontSize: 15,
  },
  sponsor: {
    backgroundColor: colors.ink,
    borderRadius: 20,
    padding: 18,
  },
  sponsorKicker: {
    color: colors.accent,
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  sponsorTitle: {
    color: colors.paper,
    fontSize: 26,
    fontWeight: "700",
    letterSpacing: -0.3,
    lineHeight: 32,
    marginTop: 8,
  },
  sponsorBody: {
    color: "#EADFCE",
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
  },
  sponsorButton: {
    alignSelf: "flex-start",
    backgroundColor: colors.accent,
    borderRadius: 999,
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  sponsorButtonOff: {
    backgroundColor: "transparent",
    borderColor: "#4A433B",
    borderWidth: 1,
  },
  sponsorButtonText: {
    color: colors.accentInk,
    fontSize: 15,
    fontWeight: "600",
  },
  sponsorButtonTextOff: {
    color: "#B7AD9F",
  },
  disclaimer: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
});
