import { presentAnalysis } from "./present";
import type { Analysis, CareerDraft, ProfileInput } from "./types";

export const exampleProfile: ProfileInput = {
  skills: ["Rédaction", "Relation client", "Notion", "SQL", "Anglais"],
  cvText: `Profil
Trois ans en relation client B2B dans une scale-up logicielle, puis un an à coordonner le contenu des réseaux. À l'aise pour écrire, prioriser des demandes et expliquer un produit à des non-spécialistes.

Expérience
Chargée de support clients, 2022-2025. Résolution des tickets, documentation interne, formation des nouveaux arrivants. Taux de satisfaction passé de 86 % à 93 %.
Community manager en alternance, 2021-2022. Calendrier éditorial, newsletters, reporting mensuel.

Formation
Licence information-communication.`,
  zone: "france",
  abroadRegion: "europe",
  customCountry: "",
  city: "Lyon",
  goal: "both",
  contract: "either",
  currentSalary: 34000,
};

const exampleCareers: CareerDraft[] = [
  {
    title: "Customer success",
    why: "Vous avez déjà tenu la relation après la vente, fait monter la satisfaction et formé des collègues. Ce métier reprend ce travail, souvent mieux payé que le support.",
    gap: "Il manque une expérience où vous portez un portefeuille de comptes et un objectif de rétention, pas seulement des tickets.",
    salaryMin: 42000,
    salaryMax: 52000,
    currency: "EUR",
    searchQuery: "customer success",
  },
  {
    title: "Responsable support client",
    why: "Vous avez documenté, priorisé et fait progresser un indicateur de satisfaction. Le pas vers le pilotage du support est court.",
    gap: "Le CV ne montre pas encore une équipe à encadrer, ni un planning de permanence à tenir.",
    salaryMin: 40000,
    salaryMax: 50000,
    currency: "EUR",
    searchQuery: "responsable support client",
  },
  {
    title: "Chargé de contenu produit",
    why: "La rédaction et l'habitude d'expliquer le produit à des non-spécialistes collent à des pages d'aide, des études de cas ou des newsletters.",
    gap: "On ne voit pas encore de contenus longs publiés, ni de travail au côté d'une équipe produit.",
    salaryMin: 36000,
    salaryMax: 46000,
    currency: "EUR",
    searchQuery: "content manager produit",
  },
  {
    title: "Product operations",
    why: "Prioriser les demandes, outiller Notion et faire le lien entre clients et équipes internes ressemble déjà à de l'ops produit.",
    gap: "Le SQL reste basique, et aucun process n'est décrit de bout en bout avec un chiffre de résultat.",
    salaryMin: 45000,
    salaryMax: 58000,
    currency: "EUR",
    searchQuery: "product operations",
  },
  {
    title: "UX writer",
    why: "Vous écrivez pour clarifier, et le support vous a montré ce que les utilisateurs ne comprennent pas.",
    gap: "Il manque des textes d'interface, ou une collaboration directe avec du design.",
    salaryMin: 38000,
    salaryMax: 50000,
    currency: "EUR",
    searchQuery: "ux writer",
  },
];

export const exampleProfileLine =
  "Trois ans de relation client B2B et une pratique régulière de la rédaction : le profil penche vers des métiers qui relient produit, clients et contenu.";

export function buildExample(): Analysis {
  return presentAnalysis(
    exampleProfileLine,
    exampleCareers,
    exampleProfile,
    "example",
  );
}
