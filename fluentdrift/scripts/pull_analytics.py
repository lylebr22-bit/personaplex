"""Pull daily YouTube analytics for the channel and save snapshots.

Fetches per-video stats (views, watch time, comments, likes) for the
last N days and writes a JSON snapshot per day. Used for tracking
the metrics that actually matter:

    - Re-watch rate proxy (avg view duration / video length)
    - Comment-to-view ratio
    - First-30-second retention (long-form only)
    - Subscriber delta

Usage:
    python scripts/pull_analytics.py --days 7
    python scripts/pull_analytics.py --days 30 --out analytics/

Requires:
    YOUTUBE_CHANNEL_ID env var
    scripts/youtube_client_secret.json (same OAuth as upload script)
    scripts/youtube_token.json (auto-created on first run)
"""
from __future__ import annotations

import argparse
import json
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path

from dotenv import load_dotenv
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build

SCOPES = [
    "https://www.googleapis.com/auth/youtube.readonly",
    "https://www.googleapis.com/auth/yt-analytics.readonly",
]

ROOT = Path(__file__).resolve().parent.parent
load_dotenv(ROOT / ".env")

CLIENT_SECRET_PATH = ROOT / "scripts" / "youtube_client_secret.json"
TOKEN_PATH = ROOT / "scripts" / "youtube_analytics_token.json"


def get_credentials() -> Credentials:
    creds: Credentials | None = None
    if TOKEN_PATH.exists():
        creds = Credentials.from_authorized_user_file(str(TOKEN_PATH), SCOPES)
    if creds and creds.expired and creds.refresh_token:
        creds.refresh(Request())
    if not creds or not creds.valid:
        if not CLIENT_SECRET_PATH.exists():
            raise FileNotFoundError(
                f"Missing {CLIENT_SECRET_PATH}. Same OAuth client as upload script."
            )
        flow = InstalledAppFlow.from_client_secrets_file(str(CLIENT_SECRET_PATH), SCOPES)
        creds = flow.run_local_server(port=0)
        TOKEN_PATH.write_text(creds.to_json())
    return creds


def list_recent_videos(yt, channel_id: str, max_results: int = 50) -> list[dict]:
    """List the most recent uploads from the channel."""
    channel_resp = yt.channels().list(part="contentDetails", id=channel_id).execute()
    items = channel_resp.get("items", [])
    if not items:
        return []
    uploads_playlist = items[0]["contentDetails"]["relatedPlaylists"]["uploads"]

    videos: list[dict] = []
    next_page = None
    while len(videos) < max_results:
        resp = yt.playlistItems().list(
            part="snippet,contentDetails",
            playlistId=uploads_playlist,
            maxResults=min(50, max_results - len(videos)),
            pageToken=next_page,
        ).execute()
        for item in resp.get("items", []):
            videos.append({
                "video_id": item["contentDetails"]["videoId"],
                "title": item["snippet"]["title"],
                "published_at": item["contentDetails"].get("videoPublishedAt"),
            })
        next_page = resp.get("nextPageToken")
        if not next_page:
            break
    return videos


def fetch_stats(yt, video_ids: list[str]) -> dict[str, dict]:
    """Fetch per-video statistics in batches of 50."""
    out: dict[str, dict] = {}
    for i in range(0, len(video_ids), 50):
        chunk = video_ids[i : i + 50]
        resp = yt.videos().list(
            part="statistics,contentDetails",
            id=",".join(chunk),
        ).execute()
        for item in resp.get("items", []):
            stats = item.get("statistics", {})
            out[item["id"]] = {
                "views": int(stats.get("viewCount", 0)),
                "likes": int(stats.get("likeCount", 0)),
                "comments": int(stats.get("commentCount", 0)),
                "duration_iso": item.get("contentDetails", {}).get("duration"),
            }
    return out


def fetch_analytics(creds: Credentials, video_id: str, days: int) -> dict:
    """Fetch retention/AVD via YouTube Analytics API."""
    yta = build("youtubeAnalytics", "v2", credentials=creds)
    end = datetime.now(timezone.utc).date()
    start = end - timedelta(days=days)
    try:
        resp = yta.reports().query(
            ids="channel==MINE",
            startDate=start.isoformat(),
            endDate=end.isoformat(),
            metrics="views,estimatedMinutesWatched,averageViewDuration,averageViewPercentage,subscribersGained",
            filters=f"video=={video_id}",
        ).execute()
        rows = resp.get("rows", [])
        if not rows:
            return {}
        cols = [h["name"] for h in resp["columnHeaders"]]
        return dict(zip(cols, rows[0]))
    except Exception as e:
        print(f"  analytics fetch failed for {video_id}: {e}", file=sys.stderr)
        return {}


def compute_proxies(stats: dict, analytics: dict) -> dict:
    """Compute the proxy metrics that matter for FluentDrift."""
    out: dict = {}
    views = stats.get("views", 0)
    if views:
        out["comment_to_view_pct"] = round(stats["comments"] / views * 100, 3)
        out["like_to_view_pct"] = round(stats["likes"] / views * 100, 3)
    avd = analytics.get("averageViewDuration")
    avp = analytics.get("averageViewPercentage")
    if avd is not None:
        out["avg_view_duration_seconds"] = avd
    if avp is not None:
        out["avg_view_percentage"] = avp
        out["rewatch_indicator"] = "high" if avp > 90 else "med" if avp > 60 else "low"
    return out


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--days", type=int, default=7, help="Lookback window in days")
    parser.add_argument("--max-videos", type=int, default=20, help="Max videos to analyze")
    parser.add_argument("--out", default="analytics", help="Output folder for snapshots")
    args = parser.parse_args()

    import os
    channel_id = os.environ.get("YOUTUBE_CHANNEL_ID")
    if not channel_id:
        print("ERROR: YOUTUBE_CHANNEL_ID not set in env", file=sys.stderr)
        return 1

    creds = get_credentials()
    yt = build("youtube", "v3", credentials=creds)

    print(f"Listing recent videos for channel {channel_id}...")
    videos = list_recent_videos(yt, channel_id, max_results=args.max_videos)
    if not videos:
        print("No videos found on this channel yet.")
        return 0

    print(f"Found {len(videos)} videos. Fetching stats + analytics...")
    stats = fetch_stats(yt, [v["video_id"] for v in videos])

    snapshot = {
        "snapshot_date": datetime.now(timezone.utc).isoformat(),
        "lookback_days": args.days,
        "videos": [],
    }
    for v in videos:
        vid_id = v["video_id"]
        s = stats.get(vid_id, {})
        a = fetch_analytics(creds, vid_id, args.days)
        snapshot["videos"].append({
            **v,
            "stats": s,
            "analytics": a,
            "proxies": compute_proxies(s, a),
        })

    out_dir = ROOT / args.out
    out_dir.mkdir(exist_ok=True, parents=True)
    fname = f"snapshot-{datetime.now(timezone.utc).strftime('%Y%m%d')}.json"
    out_path = out_dir / fname
    out_path.write_text(json.dumps(snapshot, indent=2))
    print(f"\nWrote snapshot: {out_path}")

    print("\nQuick view:")
    for entry in snapshot["videos"][:10]:
        title = entry["title"][:60]
        views = entry["stats"].get("views", 0)
        avp = entry.get("proxies", {}).get("avg_view_percentage", "?")
        ctv = entry.get("proxies", {}).get("comment_to_view_pct", "?")
        print(f"  {title}: {views} views | AVD% {avp} | C/V% {ctv}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
