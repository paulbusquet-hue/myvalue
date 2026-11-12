import { z } from "zod";

import { contracts, currencies, goals, zones, abroadRegions } from "./types";

export const profileSchema = z.object({
  skills: z.array(z.string().min(1).max(40)).max(20),
  cvText: z.string().max(20000),
  zone: z.enum(zones),
  abroadRegion: z.enum(abroadRegions),
  customCountry: z.string().max(80),
  city: z.string().max(80),
  goal: z.enum(goals),
  contract: z.enum(contracts),
  currentSalary: z.number().int().positive().max(2_000_000).nullable(),
});

export const analysisSchema = z.object({
  profileLine: z.string().min(12).max(320),
  careers: z
    .array(
      z.object({
        title: z.string().min(2).max(80),
        why: z.string().min(12).max(500),
        gap: z.string().min(12).max(400),
        salaryMin: z.number().int().positive().max(2_000_000),
        salaryMax: z.number().int().positive().max(2_000_000),
        currency: z.enum(currencies),
        searchQuery: z.string().min(2).max(80),
      }),
    )
    .length(5),
});
