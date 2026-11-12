import { buildPrompt } from "./prompt";
import { presentAnalysis } from "./present";
import { analysisSchema } from "./schema";
import type { AnalysisSettings } from "./settings";
import type { Analysis, ProfileInput } from "./types";

const jsonShape = `Réponds uniquement avec un objet JSON, sans markdown, de cette forme :
{
  "profileLine": "une phrase",
  "careers": [
    {
      "title": "intitulé",
      "why": "deux phrases",
      "gap": "une phrase",
      "salaryMin": 40000,
      "salaryMax": 52000,
      "currency": "EUR",
      "searchQuery": "deux à cinq mots"
    }
  ]
}
Le tableau careers contient exactement 5 objets. currency vaut EUR, USD ou GBP.`;

function parseJson(content: string): unknown {
  const trimmed = content.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  return JSON.parse(fenced?.[1] ?? trimmed);
}

function failureMessage(status: number, body: string): string {
  if (status === 401 || /api key|incorrect api key|unauthorized/i.test(body)) {
    return "La clé API a été refusée. Vérifiez-la dans l'app.";
  }
  if (status === 429 || /insufficient_quota|rate limit/i.test(body)) {
    return "Le service d'analyse est saturé. Réessayez dans un moment, ou ouvrez l'exemple.";
  }
  return "L'analyse n'a pas abouti. Réessayez, ou ouvrez l'exemple.";
}

async function complete(
  baseURL: string,
  apiKey: string,
  model: string,
  prompt: string,
  jsonMode: boolean,
): Promise<Response> {
  return fetch(`${baseURL}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.4,
      ...(jsonMode ? { response_format: { type: "json_object" } } : {}),
      messages: [
        {
          role: "system",
          content: "Tu réponds uniquement avec un objet JSON valide.",
        },
        { role: "user", content: prompt },
      ],
    }),
  });
}

export async function analyzeProfile(
  profile: ProfileInput,
  settings: AnalysisSettings,
): Promise<Analysis> {
  const apiKey = settings.apiKey.trim();
  if (!apiKey) {
    throw new Error("Ajoutez une clé API dans l'app, ou ouvrez l'exemple.");
  }

  const model = settings.model.trim() || "gpt-4o-mini";
  const baseURL = (settings.baseURL.trim() || "https://api.openai.com/v1").replace(
    /\/$/,
    "",
  );
  const prompt = `${buildPrompt(profile)}\n\n${jsonShape}`;

  let response: Response;
  try {
    response = await complete(baseURL, apiKey, model, prompt, true);
    if (response.status === 400) {
      response = await complete(baseURL, apiKey, model, prompt, false);
    }
  } catch {
    throw new Error("Pas de réseau. Réessayez, ou ouvrez l'exemple.");
  }

  if (!response.ok) {
    const body = await response.text();
    throw new Error(failureMessage(response.status, body));
  }

  const payload = (await response.json()) as {
    choices?: { message?: { content?: string | null } }[];
  };
  const content = payload.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("L'analyse n'a pas abouti. Réessayez, ou ouvrez l'exemple.");
  }

  let parsed: unknown;
  try {
    parsed = parseJson(content);
  } catch {
    throw new Error("L'analyse n'a pas abouti. Réessayez, ou ouvrez l'exemple.");
  }

  const checked = analysisSchema.safeParse(parsed);
  if (!checked.success) {
    throw new Error("L'analyse n'a pas abouti. Réessayez, ou ouvrez l'exemple.");
  }

  return presentAnalysis(
    checked.data.profileLine,
    checked.data.careers,
    profile,
    "model",
  );
}
