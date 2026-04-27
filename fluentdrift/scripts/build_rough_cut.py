"""Build a draft vertical video from a Short's timeline + audio.

Takes the rendered `audio/voice.mp3` plus the `timeline.json` and
assembles a 1080x1920 black-background video with timed captions
burned in. The output is NOT a polished video - it's a draft you
can watch in 30 seconds to validate pacing, captions, and beat
timing before committing to a full edit.

Usage:
    # First render the voice
    python scripts/render_short.py --short shorts/short-01-speak-30-seconds

    # Then build the rough cut
    python scripts/build_rough_cut.py --short shorts/short-01-speak-30-seconds

Requires:
    ffmpeg installed on PATH
"""
from __future__ import annotations

import argparse
import json
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

WIDTH = 1080
HEIGHT = 1920
FPS = 30
FONT_FALLBACKS = [
    "/usr/share/fonts/truetype/dejavu/DejaVu-Sans-Bold.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    "/Library/Fonts/Arial Bold.ttf",
    "/System/Library/Fonts/Helvetica.ttc",
    "C:/Windows/Fonts/arialbd.ttf",
]


def find_font() -> str | None:
    for p in FONT_FALLBACKS:
        if Path(p).exists():
            return p
    return None


def parse_timestamp(ts: str) -> float:
    """Parse mm:ss or h:mm:ss into seconds."""
    parts = [float(p) for p in ts.split(":")]
    if len(parts) == 2:
        return parts[0] * 60 + parts[1]
    if len(parts) == 3:
        return parts[0] * 3600 + parts[1] * 60 + parts[2]
    raise ValueError(f"Unrecognized timestamp: {ts}")


def build_drawtext_filter(beats: list[dict], font_path: str | None) -> str:
    """Build an ffmpeg filter chain that draws each beat's caption."""
    chains = []
    for beat in beats:
        caption = beat.get("caption") or ""
        if not caption:
            continue
        start = parse_timestamp(beat["time"])
        end = start + float(beat.get("duration", 1.0))
        clean = (
            caption.replace("'", "")
            .replace("\n", " ")
            .replace(":", "\\:")
            .replace(",", "\\,")
            .replace("|", "  ")
        )
        chunk = (
            f"drawtext="
            f"text='{clean}':"
            f"fontcolor=white:"
            f"fontsize=80:"
            f"box=1:boxcolor=black@0.55:boxborderw=18:"
            f"x=(w-text_w)/2:y=(h-text_h)/2:"
            f"enable='between(t,{start:.3f},{end:.3f})'"
        )
        if font_path:
            chunk += f":fontfile='{font_path}'"
        chains.append(chunk)
    if not chains:
        return "null"
    return ",".join(chains)


def build_rough_cut(short_dir: Path) -> Path:
    timeline = json.loads((short_dir / "timeline.json").read_text())
    duration = timeline["duration_seconds"]
    voice_path = short_dir / "audio" / "voice.mp3"
    if not voice_path.exists():
        print(
            f"ERROR: {voice_path} not found. Render first:\n"
            f"  python scripts/render_short.py --short {short_dir.relative_to(ROOT)}",
            file=sys.stderr,
        )
        sys.exit(1)

    if not shutil.which("ffmpeg"):
        print("ERROR: ffmpeg not on PATH. Install ffmpeg first.", file=sys.stderr)
        sys.exit(1)

    out = short_dir / "audio" / "rough_cut.mp4"
    font = find_font()
    drawtext = build_drawtext_filter(timeline["beats"], font)

    cmd = [
        "ffmpeg", "-y",
        "-f", "lavfi",
        "-i", f"color=c=#0B1220:s={WIDTH}x{HEIGHT}:r={FPS}:d={duration}",
        "-i", str(voice_path),
        "-filter_complex", f"[0:v]{drawtext}[v]",
        "-map", "[v]",
        "-map", "1:a",
        "-c:v", "libx264",
        "-preset", "veryfast",
        "-pix_fmt", "yuv420p",
        "-c:a", "aac",
        "-shortest",
        "-t", str(duration),
        str(out),
    ]
    print(f"Building rough cut: {out.name}")
    proc = subprocess.run(cmd, capture_output=True, text=True)
    if proc.returncode != 0:
        print("ffmpeg failed:", file=sys.stderr)
        print(proc.stderr[-2000:], file=sys.stderr)
        sys.exit(1)
    return out


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--short", required=True, help="Path to the Short folder")
    args = parser.parse_args()

    short_dir = Path(args.short)
    if not short_dir.is_absolute():
        short_dir = ROOT / args.short
    out = build_rough_cut(short_dir)
    print(f"\nWrote rough cut: {out}")
    print("Open it to validate pacing + captions before polished edit.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
