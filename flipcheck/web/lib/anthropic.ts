import Anthropic from '@anthropic-ai/sdk';
import { SYSTEM_PROMPT } from './prompts';
import { analyzeJsonSchema, type AnalyzeResponse } from './schema';

const MODEL = process.env.ANTHROPIC_MODEL || 'claude-opus-4-7';

let _client: Anthropic | null = null;
function client(): Anthropic {
  if (!_client) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY is not set on the server.');
    }
    _client = new Anthropic({ apiKey });
  }
  return _client;
}

export interface AnalyzeInput {
  imageBase64: string;
  mediaType: 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif';
  userHint?: string;
}

export async function analyzeItem(input: AnalyzeInput): Promise<AnalyzeResponse> {
  const userText = input.userHint?.trim()
    ? `Additional context from the seller: ${input.userHint.trim()}`
    : 'Appraise this item for resale.';

  const response = await client().messages.create({
    model: MODEL,
    max_tokens: 1024,
    system: [
      {
        type: 'text',
        text: SYSTEM_PROMPT,
        cache_control: { type: 'ephemeral' },
      },
    ],
    output_config: {
      format: {
        type: 'json_schema',
        schema: analyzeJsonSchema,
      },
    },
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: input.mediaType,
              data: input.imageBase64,
            },
          },
          { type: 'text', text: userText },
        ],
      },
    ],
  });

  const textBlock = response.content.find(
    (b): b is Anthropic.TextBlock => b.type === 'text',
  );
  if (!textBlock) {
    throw new Error('Model returned no text block.');
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(textBlock.text);
  } catch (err) {
    throw new Error(
      `Model returned non-JSON text: ${textBlock.text.slice(0, 200)}`,
    );
  }

  return parsed as AnalyzeResponse;
}
