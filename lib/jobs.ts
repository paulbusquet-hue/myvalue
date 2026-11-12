import type { JobLink, ProfileInput } from "./types";

const abroadLocation: Record<ProfileInput["abroadRegion"], string> = {
  europe: "Europe",
  uk: "United Kingdom",
  "north-america": "North America",
  remote: "Remote",
  custom: "",
};

const indeedHost: Record<ProfileInput["abroadRegion"], string> = {
  europe: "www.indeed.com",
  uk: "uk.indeed.com",
  "north-america": "www.indeed.com",
  remote: "www.indeed.com",
  custom: "www.indeed.com",
};

function searchLocation(profile: ProfileInput): string {
  const city = profile.city.trim();
  if (city) return city;
  if (profile.zone === "france") return "France";
  if (profile.abroadRegion === "custom") {
    return profile.customCountry.trim() || "Remote";
  }
  return abroadLocation[profile.abroadRegion];
}

function franceTravail(query: string): string {
  const params = new URLSearchParams({
    motsCles: query,
    offresPartenaires: "true",
    tri: "0",
  });
  return `https://candidat.francetravail.fr/offres/recherche?${params}`;
}

function welcomeToTheJungle(query: string, locale: "fr" | "en"): string {
  const params = new URLSearchParams({ query });
  return `https://www.welcometothejungle.com/${locale}/jobs?${params}`;
}

function linkedIn(query: string, location: string): string {
  const params = new URLSearchParams({
    keywords: query,
    location,
  });
  return `https://www.linkedin.com/jobs/search/?${params}`;
}

function indeed(query: string, location: string, host: string): string {
  const params = new URLSearchParams({ q: query, l: location });
  return `https://${host}/jobs?${params}`;
}

export function buildJobLinks(
  searchQuery: string,
  profile: ProfileInput,
): JobLink[] {
  const query = searchQuery.replace(/\s+/g, " ").trim();
  const location = searchLocation(profile);

  if (profile.zone === "france") {
    return [
      { label: "France Travail", href: franceTravail(query) },
      { label: "Welcome to the Jungle", href: welcomeToTheJungle(query, "fr") },
      { label: "LinkedIn", href: linkedIn(query, location) },
    ];
  }

  return [
    { label: "Welcome to the Jungle", href: welcomeToTheJungle(query, "en") },
    { label: "LinkedIn", href: linkedIn(query, location) },
    {
      label: "Indeed",
      href: indeed(query, location, indeedHost[profile.abroadRegion]),
    },
  ];
}
