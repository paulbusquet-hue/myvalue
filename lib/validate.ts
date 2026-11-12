import type { ProfileInput } from "./types";

export function validateProfile(profile: ProfileInput, hasFile = false): string | null {
  const cv = profile.cvText.trim();

  if (profile.skills.length === 0 && cv.length < 40 && !hasFile) {
    return "Ajoutez un CV (quelques lignes) ou au moins une compétence.";
  }

  if (cv.length > 20000) {
    return "Le CV est trop long. Gardez l'essentiel, sous 20 000 caractères.";
  }

  if (profile.skills.length > 20) {
    return "Vingt compétences maximum.";
  }

  if (profile.skills.some((skill) => skill.trim().length > 40)) {
    return "Chaque compétence doit tenir en 40 caractères.";
  }

  if (
    profile.zone === "abroad" &&
    profile.abroadRegion === "custom" &&
    profile.customCountry.trim().length < 2
  ) {
    return "Indiquez le pays qui vous intéresse.";
  }

  if (profile.city.trim().length > 80 || profile.customCountry.trim().length > 80) {
    return "Le lieu est trop long.";
  }

  if (
    profile.currentSalary != null &&
    (!Number.isInteger(profile.currentSalary) ||
      profile.currentSalary <= 0 ||
      profile.currentSalary > 2_000_000)
  ) {
    return "Indiquez un salaire annuel brut en euros, ou laissez le champ vide.";
  }

  return null;
}
