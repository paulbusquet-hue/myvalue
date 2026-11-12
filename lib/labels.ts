import type { ProfileInput } from "./types";

const regionLabels: Record<ProfileInput["abroadRegion"], string> = {
  europe: "Europe",
  uk: "Royaume-Uni",
  "north-america": "Amérique du Nord",
  remote: "Remote",
  custom: "Un pays",
};

export function regionLabel(region: ProfileInput["abroadRegion"]): string {
  return regionLabels[region];
}

export function placeLabel(profile: ProfileInput): string {
  const city = profile.city.trim();
  if (profile.zone === "france") {
    return city ? `France · ${city}` : "France";
  }

  const region =
    profile.abroadRegion === "custom"
      ? profile.customCountry.trim() || "À l'étranger"
      : regionLabels[profile.abroadRegion];

  return city ? `${region} · ${city}` : region;
}

export function preferenceLine(profile: ProfileInput): string {
  const goal = {
    pay: "Mieux payé",
    interest: "Plus intéressant",
    both: "Salaire et intérêt",
  }[profile.goal];

  const contract = {
    cdi: "CDI",
    freelance: "Freelance",
    either: "CDI ou freelance",
  }[profile.contract];

  return `${placeLabel(profile)} · ${contract} · ${goal}`;
}
