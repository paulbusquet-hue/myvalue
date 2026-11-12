import { formatMoney } from "./present";
import type { ProfileInput } from "./types";

const goalGuidance: Record<ProfileInput["goal"], string> = {
  pay: "Privilégiez des pistes mieux payées, sans sortir de ce que le CV peut raisonnablement viser.",
  interest:
    "Privilégiez l'intérêt du métier et l'adéquation avec le parcours, même si le gain de salaire est modeste.",
  both: "Cherchez le meilleur équilibre entre une hausse de salaire crédible et l'intérêt du métier.",
};

const contractGuidance: Record<ProfileInput["contract"], string> = {
  cdi: "Orientez vers des postes salariés, en CDI.",
  freelance: "Orientez vers des activités exerçables en freelance ou en mission.",
  either: "Le type de contrat est libre : salarié ou indépendant.",
};

function marketGuidance(profile: ProfileInput): string {
  const city = profile.city.trim();
  const cityLine = city ? ` Ville citée : ${city}.` : "";

  if (profile.zone === "france") {
    return `Marché : France.${cityLine} Fourchettes en EUR, brut annuel. searchQuery en français, ou dans les mots réellement tapés sur les job boards français.`;
  }

  const region = {
    europe: "Europe. Devise EUR, sauf métier clairement londonien.",
    uk: "Royaume-Uni. Devise GBP, brut annuel.",
    "north-america": "Amérique du Nord. Devise USD, brut annuel.",
    remote: "Remote, sans pays fixe. Devise EUR.",
    custom: `Pays : ${profile.customCountry.trim() || "non précisé"}. Choisissez EUR, USD ou GBP selon ce marché.`,
  }[profile.abroadRegion];

  return `Marché : étranger, ${region}${cityLine} searchQuery en anglais, court, tel qu'on le tape dans LinkedIn ou Indeed.`;
}

export function buildPrompt(profile: ProfileInput): string {
  const skills =
    profile.skills.length > 0 ? profile.skills.join(", ") : "Aucune compétence listée à part.";
  const cv = profile.cvText.trim().slice(0, 15000) || "CV non fourni.";
  const salary =
    profile.currentSalary == null
      ? "non communiqué"
      : `${formatMoney(profile.currentSalary, "EUR")} brut annuel`;

  return `Tu es conseiller carrière pour MyValue. À partir du profil ci-dessous, propose exactement 5 métiers distincts, du plus directement accessible au plus ambitieux encore crédible.

Règles :
- Français, vouvoiement, pour profileLine, title, why et gap.
- profileLine : une seule phrase qui résume le profil, sans jugement sur le salaire.
- why : deux phrases. Pourquoi ce métier colle à ce CV, avec un fait précis du parcours.
- gap : une phrase. La compétence ou l'expérience qui manque, concrète.
- salaryMin et salaryMax : entiers, brut annuel, fourchette indicative crédible pour ce niveau d'expérience. salaryMin est strictement inférieur à salaryMax. Pas de package de dirigeant si le CV ne le montre pas.
- currency : EUR, USD ou GBP, selon le marché indiqué.
- searchQuery : 2 à 5 mots, sans guillemets, sans opérateurs, prêt à coller dans un moteur d'offres.
- Cinq métiers vraiment différents, pas cinq reformulations du même poste.
- N'invente ni employeur, ni URL, ni diplôme absent du CV.
- Ne dis pas que la personne est sous-payée et ne calcule aucun écart. Un autre système s'en charge.
- ${goalGuidance[profile.goal]}
- ${contractGuidance[profile.contract]}
- ${marketGuidance(profile)}

Compétences déclarées : ${skills}
Salaire actuel : ${salary}

CV :
${cv}`;
}
