export type Sponsor = {
  kicker: string;
  headline: string;
  body: string;
  cta: string;
  href: string;
  active: boolean;
};

/**
 * Passez `active` à true et renseignez une URL http(s) pour ouvrir le bouton.
 * Sans cela, l'encart reste visible et le bouton est désactivé.
 */
export const sponsor: Sponsor = {
  kicker: "Emplacement partenaire",
  headline: "On ne vous paye pas assez pour vos compétences ?",
  body: "Un partenaire pourra proposer ici une formation, un outil ou une piste à tester.",
  cta: "Tester",
  href: "",
  active: false,
};
