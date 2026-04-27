"""Generate a complete Short folder from a topic + outline.

Calls Anthropic's Claude (Sonnet 4.6) to draft the script, timeline,
captions, and metadata for a new Short. The output is saved as 4
files in `shorts/<slug>/` matching the same structure as the
hand-built Shorts in this repo.

Usage:
    python scripts/generate_short.py \
        --slug short-16-th-sound \
        --topic "The TH sound is giving you away" \
        --duration 30 \
        --hook "Native speakers can spot a non-native in one sound."

    # Then review and tighten the generated files before rendering.

Requires:
    ANTHROPIC_API_KEY in environment (or .env)

The generated draft is a STARTING POINT, not a publish-ready file.
Always review for:
    - Originality (does it sound like every other AI Short?)
    - Re-watch engineering (does it have the 5 mechanics?)
    - Compliance (does it match SHORTS_POLICY.md?)
"""
from __future__ import annotations

import argparse
import json
import os
import re
import sys
from pathlib import Path

from anthropic import Anthropic
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parent.parent
load_dotenv(ROOT / ".env")

MODEL = "claude-sonnet-4-6"

SYSTEM_PROMPT = """You are a senior YouTube Shorts producer for FluentDrift,
a faceless channel teaching intermediate (B1-B2) English learners.

Every Short you write must include all 5 re-watch mechanics:
1. Seamless loop (last frame matches first)
2. Hidden detail (only visible on watch #2)
3. Punchline reveal (last 3s recontextualizes opening)
4. Information density (too much value to absorb once)
5. Visual rhythm (cuts and captions sync to audio beats)

Constraints:
- Faceless: only silhouettes, hands, environments, motion graphics
- ESL audience: simple vocabulary, slow enough to follow on first watch
- Voice: ElevenLabs Brian, 165-175 wpm for Shorts
- Captions: 1-3 words per card, pop-style instant entry
- Sound design: at least 3 distinct SFX events
- Compliance: cite any stat with a real source watermark in-frame

Output ONLY a JSON object with these top-level keys:
- script_md: string (the full script.md file content)
- timeline_json: object (the timeline.json content)
- captions_srt: string (the captions.srt content)
- metadata_json: object (the metadata.json content)

Use the same structure and depth as the existing FluentDrift Shorts
in this repo. Do not include any explanation outside the JSON.
"""


def build_user_prompt(slug: str, topic: str, duration: int, hook: str) -> str:
    return f"""Create a complete FluentDrift Short package.

Slug: {slug}
Topic: {topic}
Target duration: {duration} seconds
Opening hook idea: {hook}

Generate the four files exactly as the structure in shorts/short-01,
shorts/short-02, shorts/short-03 in the FluentDrift repo. Match the
JSON shape exactly. Be specific - real visual descriptions, real SFX
file names, real timecodes.

Make the loop trick concrete. Make the hidden detail actually planted
in a specific beat. Make the punchline rewrite the opening's meaning.
"""


def generate(slug: str, topic: str, duration: int, hook: str) -> dict:
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        raise RuntimeError("ANTHROPIC_API_KEY not set. Copy .env.example to .env.")
    client = Anthropic(api_key=api_key)

    response = client.messages.create(
        model=MODEL,
        max_tokens=8000,
        system=SYSTEM_PROMPT,
        messages=[
            {"role": "user", "content": build_user_prompt(slug, topic, duration, hook)}
        ],
    )
    text = response.content[0].text

    match = re.search(r"\{.*\}", text, re.DOTALL)
    if not match:
        raise RuntimeError(f"Model did not return JSON. Got:\n{text[:500]}")
    return json.loads(match.group(0))


def write_short(slug: str, payload: dict) -> Path:
    out_dir = ROOT / "shorts" / slug
    out_dir.mkdir(parents=True, exist_ok=True)

    (out_dir / "script.md").write_text(payload["script_md"])
    (out_dir / "timeline.json").write_text(json.dumps(payload["timeline_json"], indent=2))
    (out_dir / "captions.srt").write_text(payload["captions_srt"])
    (out_dir / "metadata.json").write_text(json.dumps(payload["metadata_json"], indent=2))
    return out_dir


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--slug", required=True, help="Folder slug, e.g. short-16-th-sound")
    parser.add_argument("--topic", required=True, help="Internal topic / working title")
    parser.add_argument("--duration", type=int, default=30, help="Target seconds (default: 30)")
    parser.add_argument("--hook", default="", help="Opening line idea")
    args = parser.parse_args()

    print(f"Generating Short: {args.topic}")
    payload = generate(args.slug, args.topic, args.duration, args.hook)
    out_dir = write_short(args.slug, payload)
    print(f"\nWrote 4 files to: {out_dir}")
    print("\nReview before rendering:")
    print("  1. Open script.md and read it out loud - does it sound human?")
    print("  2. Open timeline.json and check the loop trick + hidden detail")
    print("  3. Run SHORTS_POLICY.md checklist")
    print(f"\nThen render:")
    print(f"  python scripts/render_short.py --short shorts/{args.slug}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
