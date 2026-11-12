export const zones = ["france", "abroad"] as const;
export const abroadRegions = [
  "europe",
  "uk",
  "north-america",
  "remote",
  "custom",
] as const;
export const goals = ["pay", "interest", "both"] as const;
export const contracts = ["cdi", "freelance", "either"] as const;
export const currencies = ["EUR", "USD", "GBP"] as const;

export type Zone = (typeof zones)[number];
export type AbroadRegion = (typeof abroadRegions)[number];
export type Goal = (typeof goals)[number];
export type Contract = (typeof contracts)[number];
export type Currency = (typeof currencies)[number];

export type ProfileInput = {
  skills: string[];
  cvText: string;
  zone: Zone;
  abroadRegion: AbroadRegion;
  customCountry: string;
  city: string;
  goal: Goal;
  contract: Contract;
  currentSalary: number | null;
};

export type JobLink = {
  label: string;
  href: string;
};

export type CareerDraft = {
  title: string;
  why: string;
  gap: string;
  salaryMin: number;
  salaryMax: number;
  currency: Currency;
  searchQuery: string;
};

export type CareerCard = CareerDraft & {
  gapNote: string | null;
  links: JobLink[];
};

export type Analysis = {
  source: "model" | "example";
  profileLine: string;
  careers: CareerCard[];
};

export const emptyProfile: ProfileInput = {
  skills: [],
  cvText: "",
  zone: "france",
  abroadRegion: "europe",
  customCountry: "",
  city: "",
  goal: "both",
  contract: "either",
  currentSalary: null,
};
