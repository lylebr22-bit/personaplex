"""Render the episode narration with ElevenLabs.

Reads `script.md` from the given episode folder, strips production
directions, and sends each scene to the ElevenLabs TTS API. Outputs
per-scene MP3s plus a concatenated `narration.mp3`.

Usage:
    python scripts/render_voice.py --episode episode-01-plateau-breaker

Requires:
    ELEVENLABS_API_KEY in environment (or .env file)
    ELEVENLABS_VOICE_ID (defaults to Brian)
    ELEVENLABS_MODEL_ID (defaults to eleven_multilingual_v2)
"""
from __future__ import annotations

import argparse
import os
import re
import sys
from pathlib import Path

import requests
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parent.parent
load_dotenv(ROOT / ".env")

API_KEY = os.environ.get("ELEVENLABS_API_KEY")
VOICE_ID = os.environ.get("ELEVENLABS_VOICE_ID", "nPczCjzI2devNBz1zQrb")
MODEL_ID = os.environ.get("ELEVENLABS_MODEL_ID", "eleven_multilingual_v2")

API_URL = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}"

VOICE_SETTINGS = {
    "stability": 0.45,
    "similarity_boost": 0.75,
    "style": 0.35,
    "use_speaker_boost": True,
}


SCENE_HEADER_RE = re.compile(r"^##\s+Scene\s+(\d+)\s*\[([^\]]+)\]\s*-\s*(.+)$")


def parse_script(script_path: Path) -> list[dict]:
    """Extract speakable text per scene from the markdown script.

    A scene begins at `## Scene N [start - end] - Label`.
    Spoken lines are markdown blockquotes (start with `>`).
    Bracketed stage directions on spoken lines are stripped.
    """
    scenes: list[dict] = []
    current: dict | None = None

    for raw in script_path.read_text(encoding="utf-8").splitlines():
        header = SCENE_HEADER_RE.match(raw)
        if header:
            if current is not None:
                scenes.append(current)
            current = {
                "scene": int(header.group(1)),
                "timing": header.group(2).strip(),
                "label": header.group(3).strip(),
                "lines": [],
            }
            continue
        if current is None:
            continue
        stripped = raw.strip()
        if not stripped.startswith(">"):
            continue
        spoken = stripped.lstrip(">").strip()
        spoken = re.sub(r"\[[^\]]*\]", "", spoken).strip()
        spoken = re.sub(r"\*([^*]+)\*", r"\1", spoken)
        spoken = re.sub(r"\(phoneme:[^)]+\)", "", spoken).strip()
        if spoken:
            current["lines"].append(spoken)

    if current is not None:
        scenes.append(current)
    return scenes


def render_scene(text: str, out_path: Path) -> None:
    """POST a single scene's text to ElevenLabs, save the returned MP3."""
    if not API_KEY:
        raise RuntimeError(
            "ELEVENLABS_API_KEY is not set. Copy .env.example to .env "
            "and paste your key."
        )
    headers = {
        "xi-api-key": API_KEY,
        "Accept": "audio/mpeg",
        "Content-Type": "application/json",
    }
    payload = {
        "text": text,
        "model_id": MODEL_ID,
        "voice_settings": VOICE_SETTINGS,
    }
    resp = requests.post(API_URL, headers=headers, json=payload, timeout=120)
    resp.raise_for_status()
    out_path.write_bytes(resp.content)


def concat_mp3s(parts: list[Path], out_path: Path) -> None:
    """Naive MP3 concat - works for ElevenLabs fixed-bitrate output.

    For production, re-encode through ffmpeg if you plan to edit the
    combined file.
    """
    with out_path.open("wb") as fh:
        for part in parts:
            fh.write(part.read_bytes())


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--episode",
        required=True,
        help="Episode folder name, e.g. episode-01-plateau-breaker",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Parse the script and print per-scene text without calling the API",
    )
    args = parser.parse_args()

    episode_dir = ROOT / args.episode
    script_path = episode_dir / "script.md"
    if not script_path.exists():
        print(f"ERROR: {script_path} not found", file=sys.stderr)
        return 1

    scenes = parse_script(script_path)
    print(f"Parsed {len(scenes)} scenes from {script_path.name}")

    if args.dry_run:
        for scene in scenes:
            joined = " ".join(scene["lines"])
            print(f"\n--- Scene {scene['scene']:02d} [{scene['timing']}] {scene['label']} ---")
            print(joined)
            print(f"  ({len(joined.split())} words)")
        return 0

    audio_dir = episode_dir / "audio"
    audio_dir.mkdir(exist_ok=True)

    parts: list[Path] = []
    for scene in scenes:
        text = " ".join(scene["lines"])
        if not text:
            continue
        out = audio_dir / f"scene-{scene['scene']:02d}.mp3"
        print(f"Rendering scene {scene['scene']:02d} ({len(text.split())} words) -> {out.name}")
        render_scene(text, out)
        parts.append(out)

    narration = audio_dir / "narration.mp3"
    concat_mp3s(parts, narration)
    print(f"\nWrote combined narration: {narration}")
    print("Done.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
