import Constants from 'expo-constants';

export type Condition = 'New' | 'Like New' | 'Good' | 'Fair' | 'Poor' | 'Unknown';
export type Confidence = 'high' | 'medium' | 'low';

export interface AnalyzeResponse {
  itemName: string;
  category: string;
  brand: string | null;
  conditionEstimate: Condition;
  estimatedValue: {
    low: number;
    high: number;
    currency: 'USD';
  };
  bestPlatform: string;
  platformReasoning: string;
  suggestedTitle: string;
  sellingTips: string[];
  confidence: Confidence;
  warnings: string[];
}

function getApiUrl(): string {
  const fromEnv = process.env.EXPO_PUBLIC_API_URL;
  if (fromEnv) return fromEnv;
  const fromExtra = (Constants.expoConfig?.extra as { apiUrl?: string } | undefined)
    ?.apiUrl;
  return fromExtra ?? 'http://localhost:3000';
}

export async function analyzeImage(
  imageBase64: string,
  mediaType: 'image/jpeg' | 'image/png',
  userHint?: string,
): Promise<AnalyzeResponse> {
  const url = `${getApiUrl()}/api/analyze`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageBase64, mediaType, userHint }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Analyze failed (${res.status}): ${body.slice(0, 200)}`);
  }

  return (await res.json()) as AnalyzeResponse;
}
