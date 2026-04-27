# FluentDrift

A faceless YouTube channel publishing daily English podcasts for
intermediate (B1-B2) learners. Niche was selected via competitive
research: high RPM (~$11.88), under-served (~10K competing channels),
and high growth (21x YoY).

This folder contains everything needed to produce, render, edit,
publish, track, and scale the channel.

## Repository layout

```
fluentdrift/
|-- README.md                          This file
|-- .env.example                       Required API keys (copy to .env)
|-- .gitignore                         Excludes secrets + large media
|-- SHORTS_POLICY.md                   2026 monetization compliance gate
|-- content-backlog.md                 30 Shorts + 5 Episodes queued
|-- scaling-playbook.md                Week-by-week 0 to 100K plan
|
|-- channel-assets/
|   \-- brand-guide.md                 Name, colors, fonts, voice spec
|
|-- episode-01-plateau-breaker/        Episode 1, fully packaged
|-- episode-02-translate-in-your-head/ Episode 2, fully packaged
|
|-- shorts/
|   |-- README.md                      Production flow, launch schedule
|   |-- short-01-speak-30-seconds      from Episode 1 / PI 1
|   |-- short-02-cambridge-proved      from Episode 1 / PI 2
|   |-- short-03-mei-7-years           from Episode 1 / PI 3
|   |-- short-04-translate-trap        from Episode 2 / PI 1
|   |-- short-05-3-step-translation-fix from Episode 2 / PI 2
|   \-- short-06-thinking-vs-translating from Episode 2 / PI 3
|
\-- scripts/
    |-- render_voice.py                ElevenLabs TTS for long-form
    |-- render_short.py                ElevenLabs TTS for Shorts
    |-- generate_short.py              Anthropic-powered Shorts factory
    |-- build_rough_cut.py             ffmpeg draft-cut assembler
    |-- pull_analytics.py              YouTube Data + Analytics CLI
    |-- upload_youtube.py              YouTube Data API uploader
    \-- requirements.txt
```

Each episode folder contains: `script.md`, `storyboard.md`,
`assets.json`, `metadata.json`, `metadata.md`, `community.md`,
`thumbnail.html`, and `thumbnail-spec.md`.

Each short folder contains: `script.md`, `timeline.json`,
`captions.srt`, `metadata.json`.

## Long-form production flow

1. **Read** `episode-XX/script.md` - confirm pacing, fix typos
2. **Render**: `python scripts/render_voice.py --episode episode-XX`
3. **Gather B-roll** from `assets.json` into `episode-XX/b-roll/`
4. **Edit** in DaVinci/Premiere/CapCut following `storyboard.md`
5. **Thumbnail**: open `thumbnail.html` in Chrome, screenshot at 1280x720
6. **Run SHORTS_POLICY.md checklist** (long-form rules apply too)
7. **Upload**: `python scripts/upload_youtube.py --episode episode-XX --video final-cut.mp4`

## Shorts production flow

1. **Render the voice**: `python scripts/render_short.py --short shorts/short-XX-slug`
2. **Build a draft cut** for pacing review:
   `python scripts/build_rough_cut.py --short shorts/short-XX-slug`
3. **Polish** in CapCut following `timeline.json`. Hardcode captions
   from `captions.srt`. Add SFX listed per beat.
4. **Compliance check**: run `SHORTS_POLICY.md` checklist
5. **Upload manually** via YouTube Studio (faster than API for Shorts)
   - Toggle "Altered or synthetic content" ON
   - Title, description, tags from `metadata.json`

## Generating new Shorts at scale

When the backlog needs more Shorts (Group B in `content-backlog.md`):

```
python scripts/generate_short.py \
    --slug short-16-th-sound \
    --topic "The TH sound is giving you away" \
    --duration 30 \
    --hook "Native speakers can spot a non-native in one sound."
```

This creates a complete 4-file folder ready to render. ALWAYS review
the generated draft against `SHORTS_POLICY.md` before publishing.
The generator is a draft tool, not a publish tool.

## Tracking what's working

After the channel has at least 3 published videos, run:

```
python scripts/pull_analytics.py --days 7
```

This pulls daily snapshots into `analytics/snapshot-YYYYMMDD.json`
with per-video views, comment-to-view ratio, and the rewatch
indicator (high/med/low based on AVD%). Compare snapshots week
over week to identify which formats deserve sequels and which
to retire.

## Metrics to watch (long-form)

| Signal                       | Target            | If below target       |
|------------------------------|-------------------|-----------------------|
| First-30-second retention    | >= 70%            | Hook is weak          |
| Average view duration        | >= 55% of length  | Pacing is too slow    |
| Comment-to-view ratio        | >= 1.5%           | Pinned CTA not firing |
| CTR (impressions -> views)   | >= 6%             | Thumbnail or title    |
| Affiliate-link clicks        | >= 0.8% of views  | Description hierarchy |

## Metrics to watch (Shorts)

| Signal                       | Target            | If below target       |
|------------------------------|-------------------|-----------------------|
| First-3-second retention     | >= 80%            | Visual hook fails     |
| Average view percentage      | >= 90%            | Pacing too slow       |
| Re-watch rate (proxy)        | >= 25%            | No loop trick         |
| Comment-to-view ratio        | >= 2%             | No reply hook         |

## Compliance is non-negotiable

Read `SHORTS_POLICY.md` before publishing anything. The 2026
"inauthentic content" policy demonetizes channels for mass-produced
AI templates. Every video must:

- Have the "Altered or synthetic content" toggle ON if AI voice/visuals
- Cite stats with on-screen sources
- Vary the structural template every 3 uploads
- Have provable human editorial input

## Scaling

Read `scaling-playbook.md` for the week-by-week plan. Stop guessing;
follow the cadence. Channel growth is more sensitive to consistency
than to quality spikes.

Current state of the repo:
- 2 long-form Episodes packaged and ready to render
- 6 Shorts packaged and ready to render
- 4 production scripts (render long-form, render shorts, generate
  shorts, build rough cut, pull analytics, upload)
- 30 Shorts + 5 Episodes mapped in the content backlog
