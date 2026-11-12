import * as SecureStore from "expo-secure-store";

const keyId = "myvalue.apiKey";
const modelId = "myvalue.model";
const baseId = "myvalue.baseURL";

export type AnalysisSettings = {
  apiKey: string;
  model: string;
  baseURL: string;
};

export const defaultSettings: AnalysisSettings = {
  apiKey: "",
  model: "gpt-4o-mini",
  baseURL: "https://api.openai.com/v1",
};

export async function loadSettings(): Promise<AnalysisSettings> {
  try {
    const [apiKey, model, baseURL] = await Promise.all([
      SecureStore.getItemAsync(keyId),
      SecureStore.getItemAsync(modelId),
      SecureStore.getItemAsync(baseId),
    ]);
    return {
      apiKey: apiKey ?? "",
      model: model || defaultSettings.model,
      baseURL: baseURL || defaultSettings.baseURL,
    };
  } catch {
    return defaultSettings;
  }
}

export async function saveSettings(settings: AnalysisSettings): Promise<void> {
  const apiKey = settings.apiKey.trim();
  const model = settings.model.trim() || defaultSettings.model;
  const baseURL = settings.baseURL.trim() || defaultSettings.baseURL;

  if (apiKey) {
    await SecureStore.setItemAsync(keyId, apiKey);
  } else {
    await SecureStore.deleteItemAsync(keyId).catch(() => undefined);
  }
  await SecureStore.setItemAsync(modelId, model);
  await SecureStore.setItemAsync(baseId, baseURL);
}
