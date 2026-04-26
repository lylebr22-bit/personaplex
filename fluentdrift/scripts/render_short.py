"""Render a single Short's narration using its `timeline.json`.

Shorts have different voice settings than long-form (faster pace,
tighter breaths, higher style). This script reads the per-Short
voice config from `timeline.json` so each Short can have its own
cadence.

Usage:
    python scripts/render_short.py --short shorts/short-01-speak-30-seconds
    python scripts/render_short.py --short shorts/short-02-cambridge-proved --dry-run

Outputs:
    <short>/audio/voice.mp3              concatenated narration
    <short>/audio/beat-NN.mp3            per-beat clips for editor scrubbing
"""
from __future__ import annotations

import argparse
import json
import os
import sys
from pathlib import Path

import requests
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parent.parent
load_dotenv(ROOT / ".env")

API_KEY = os.environ.get("ELEVENLABS_API_KEY")
DEFAULT_VOICE_ID = os.environ.get("ELEVENLABS_VOICE_ID", "nPczCjzI2devNBz1zQrb")
DEFAULT_MODEL_ID = os.environ.get("ELEVENLABS_MODEL_ID", "eleven_multilingual_v2")


def render_clip(text: str, voice: dict, out_path: Path) -> None:
    if not API_KEY:
        raise RuntimeError(
            "ELEVENLABS_API_KEY is not set. Copy .env.example to .env "
            "and paste your key."
        )
    voice_id = voice.get("voice_id", DEFAULT_VOICE_ID)
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"
    headers = {
        "xi-api-key": API_KEY,
        "Accept": "audio/mpeg",
        "Content-Type": "application/json",
    }
    payload = {
        "text": text,
        "model_id": voice.get("engine_model", DEFAULT_MODEL_ID),
        "voice_settings": {
            "stability": voice.get("stability", 0.45),
            "similarity_boost": voice.get("similarity_boost", 0.75),
            "style": voice.get("style", 0.40),
            "use_speaker_boost": voice.get("use_speaker_boost", True),
        },
    }
    resp = requests.post(url, headers=headers, json=payload, timeout=120)
    resp.raise_for_status()
    out_path.write_bytes(resp.content)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--short", required=True, help="Path to the Short folder")
    parser.add_argument("--dry-run", action="store_true", help="Print spoken lines without rendering")
    args = parser.parse_args()

    short_dir = Path(args.short)
    if not short_dir.is_absolute():
        short_dir = ROOT / args.short
    timeline_path = short_dir / "timeline.json"
    if not timeline_path.exists():
        print(f"ERROR: {timeline_path} not found", file=sys.stderr)
        return 1

    timeline = json.loads(timeline_path.read_text())
    voice = timeline.get("voice", {})
    beats = timeline.get("beats", [])
    spoken_beats = [b for b in beats if b.get("voice_line")]

    print(f"Short: {timeline.get('title_internal', short_dir.name)}")
    print(f"Beats with voice: {len(spoken_beats)} / {len(beats)} total")
    total_words = sum(len(b["voice_line"].split()) for b in spoken_beats)
    print(f"Total spoken words: {total_words}")
    print(f"Voice WPM target: {voice.get('wpm', 'unset')}")

    if args.dry_run:
        for b in spoken_beats:
            print(f"\n[{b['time']}] {b['voice_line']}")
        return 0

    audio_dir = short_dir / "audio"
    audio_dir.mkdir(exist_ok=True)

    parts: list[Path] = []
    for i, beat in enumerate(spoken_beats):
        idx = i + 1
        out = audio_dir / f"beat-{idx:02d}.mp3"
        print(f"Rendering beat {idx:02d} [{beat['time']}]: {beat['voice_line'][:50]}...")
        render_clip(beat["voice_line"], voice, out)
        parts.append(out)

    combined = audio_dir / "voice.mp3"
    with combined.open("wb") as fh:
        for p in parts:
            fh.write(p.read_bytes())
    print(f"\nWrote combined narration: {combined}")
    print("Done.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
