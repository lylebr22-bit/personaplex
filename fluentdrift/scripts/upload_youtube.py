"""Upload the final-cut episode to YouTube with metadata + thumbnail.

Reads `metadata.json` from the episode folder and ships the video.
Uses OAuth 2.0 - on first run, opens a browser window for consent and
caches the token in `scripts/youtube_token.json`.

Setup (one-time):
    1. Create an OAuth client at https://console.cloud.google.com
       (type: Desktop app) in a project that has the YouTube Data API
       v3 enabled.
    2. Download `client_secret.json` and save it as
       `scripts/youtube_client_secret.json`.

Usage:
    python scripts/upload_youtube.py \
        --episode episode-01-plateau-breaker \
        --video episode-01-plateau-breaker/final-cut.mp4
"""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

from dotenv import load_dotenv
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload

SCOPES = ["https://www.googleapis.com/auth/youtube.upload"]

ROOT = Path(__file__).resolve().parent.parent
load_dotenv(ROOT / ".env")

CLIENT_SECRET_PATH = ROOT / "scripts" / "youtube_client_secret.json"
TOKEN_PATH = ROOT / "scripts" / "youtube_token.json"


def get_credentials() -> Credentials:
    """Get OAuth creds, refreshing or re-authing if needed."""
    creds: Credentials | None = None
    if TOKEN_PATH.exists():
        creds = Credentials.from_authorized_user_file(str(TOKEN_PATH), SCOPES)
    if creds and creds.expired and creds.refresh_token:
        creds.refresh(Request())
    if not creds or not creds.valid:
        if not CLIENT_SECRET_PATH.exists():
            raise FileNotFoundError(
                f"Missing {CLIENT_SECRET_PATH}. Create an OAuth desktop "
                "client in Google Cloud Console and download its JSON there."
            )
        flow = InstalledAppFlow.from_client_secrets_file(
            str(CLIENT_SECRET_PATH), SCOPES
        )
        creds = flow.run_local_server(port=0)
        TOKEN_PATH.write_text(creds.to_json())
    return creds


def build_body(meta: dict) -> dict:
    snippet = {
        "title": meta["title"],
        "description": meta["description"],
        "tags": meta["tags"],
        "categoryId": meta.get("categoryId", "27"),
        "defaultLanguage": meta.get("defaultLanguage", "en"),
        "defaultAudioLanguage": meta.get("defaultAudioLanguage", "en"),
    }
    status = {
        "privacyStatus": meta.get("privacyStatus", "private"),
        "selfDeclaredMadeForKids": meta.get("madeForKids", False),
        "embeddable": True,
        "publicStatsViewable": True,
    }
    if meta.get("publishAt"):
        status["publishAt"] = meta["publishAt"]
        status["privacyStatus"] = "private"
    return {"snippet": snippet, "status": status}


def upload(video_path: Path, meta: dict, thumbnail_path: Path | None) -> str:
    creds = get_credentials()
    yt = build("youtube", "v3", credentials=creds)

    body = build_body(meta)
    media = MediaFileUpload(
        str(video_path), mimetype="video/*", resumable=True, chunksize=-1
    )
    request = yt.videos().insert(part="snippet,status", body=body, media_body=media)

    print(f"Uploading {video_path.name} ({video_path.stat().st_size / 1_000_000:.1f} MB)...")
    response = None
    while response is None:
        status, response = request.next_chunk()
        if status:
            print(f"  {int(status.progress() * 100)}%")
    video_id = response["id"]
    print(f"Video live at https://youtu.be/{video_id}")

    if thumbnail_path and thumbnail_path.exists():
        print(f"Uploading thumbnail: {thumbnail_path.name}")
        yt.thumbnails().set(videoId=video_id, media_body=str(thumbnail_path)).execute()

    for playlist_id in meta.get("playlistIds", []):
        print(f"Adding to playlist {playlist_id}")
        yt.playlistItems().insert(
            part="snippet",
            body={
                "snippet": {
                    "playlistId": playlist_id,
                    "resourceId": {"kind": "youtube#video", "videoId": video_id},
                }
            },
        ).execute()

    return video_id


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--episode", required=True, help="Episode folder name")
    parser.add_argument("--video", required=True, help="Path to the final-cut video file")
    parser.add_argument("--thumbnail", default=None, help="Override thumbnail path")
    args = parser.parse_args()

    episode_dir = ROOT / args.episode
    meta_path = episode_dir / "metadata.json"
    if not meta_path.exists():
        print(f"ERROR: {meta_path} not found", file=sys.stderr)
        return 1

    meta = json.loads(meta_path.read_text())
    video_path = Path(args.video)
    if not video_path.is_absolute():
        video_path = ROOT / args.video
    if not video_path.exists():
        print(f"ERROR: video not found: {video_path}", file=sys.stderr)
        return 1

    if args.thumbnail:
        thumb = Path(args.thumbnail)
        if not thumb.is_absolute():
            thumb = ROOT / args.thumbnail
    else:
        thumb = episode_dir / meta.get("thumbnailPath", "thumbnail.png")

    video_id = upload(video_path, meta, thumb if thumb.exists() else None)
    print(f"\nDone. Video ID: {video_id}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
