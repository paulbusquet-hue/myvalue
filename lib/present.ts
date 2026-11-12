import { buildJobLinks } from "./jobs";
import type {
  Analysis,
  CareerDraft,
  Currency,
  ProfileInput,
} from "./types";

export function formatMoney(amount: number, currency: Currency): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function buildGapNote(
  currentSalary: number | null,
  salaryMin: number,
  currency: Currency,
): string | null {
  if (currentSalary == null || currentSalary >= salaryMin) return null;
  const diff = salaryMin - currentSalary;
  return `Le bas de la fourchette indicative est ${formatMoney(diff, currency)} au-dessus de votre salaire actuel.`;
}

export function presentAnalysis(
  profileLine: string,
  drafts: CareerDraft[],
  profile: ProfileInput,
  source: Analysis["source"],
): Analysis {
  return {
    source,
    profileLine: profileLine.trim(),
    careers: drafts.slice(0, 5).map((draft) => {
      const salaryMin = Math.round(Math.min(draft.salaryMin, draft.salaryMax));
      const rawMax = Math.round(Math.max(draft.salaryMin, draft.salaryMax));
      const salaryMax =
        rawMax > salaryMin ? rawMax : salaryMin + Math.max(2000, Math.round(salaryMin * 0.15));
      const searchQuery = draft.searchQuery.replace(/\s+/g, " ").trim();

      return {
        title: draft.title.trim(),
        why: draft.why.trim(),
        gap: draft.gap.trim(),
        salaryMin,
        salaryMax,
        currency: draft.currency,
        searchQuery,
        gapNote: buildGapNote(profile.currentSalary, salaryMin, draft.currency),
        links: buildJobLinks(searchQuery, profile),
      };
    }),
  };
}
