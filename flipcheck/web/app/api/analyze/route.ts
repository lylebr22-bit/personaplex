import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { analyzeItem } from '@/lib/anthropic';

export const runtime = 'nodejs';
export const maxDuration = 60;

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'] as const;

type AllowedType = (typeof ALLOWED_TYPES)[number];

function isAllowedType(x: string): x is AllowedType {
  return (ALLOWED_TYPES as readonly string[]).includes(x);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: 'Body must be JSON with { imageBase64, mediaType, userHint? }' },
        { status: 400 },
      );
    }

    const { imageBase64, mediaType, userHint } = body as {
      imageBase64?: unknown;
      mediaType?: unknown;
      userHint?: unknown;
    };

    if (typeof imageBase64 !== 'string' || imageBase64.length === 0) {
      return NextResponse.json({ error: 'imageBase64 is required.' }, { status: 400 });
    }
    if (typeof mediaType !== 'string' || !isAllowedType(mediaType)) {
      return NextResponse.json(
        { error: `mediaType must be one of ${ALLOWED_TYPES.join(', ')}.` },
        { status: 400 },
      );
    }

    const approxBytes = Math.ceil((imageBase64.length * 3) / 4);
    if (approxBytes > MAX_IMAGE_BYTES) {
      return NextResponse.json(
        { error: `Image too large (max ${MAX_IMAGE_BYTES} bytes).` },
        { status: 413 },
      );
    }

    const hint =
      typeof userHint === 'string' && userHint.length <= 500 ? userHint : undefined;

    const result = await analyzeItem({
      imageBase64,
      mediaType,
      userHint: hint,
    });

    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof Anthropic.BadRequestError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    if (err instanceof Anthropic.AuthenticationError) {
      return NextResponse.json({ error: 'Server misconfigured.' }, { status: 500 });
    }
    if (err instanceof Anthropic.RateLimitError) {
      return NextResponse.json(
        { error: 'Service busy, please retry.' },
        { status: 429 },
      );
    }
    if (err instanceof Anthropic.APIError) {
      return NextResponse.json({ error: err.message }, { status: err.status ?? 500 });
    }
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, endpoint: 'POST /api/analyze' });
}
