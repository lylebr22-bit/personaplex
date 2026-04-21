# FluentDrift

A faceless YouTube channel publishing daily English podcasts for
intermediate (B1-B2) learners. Niche was selected via competitive
research: high RPM (~$11.88), under-served (~10K competing channels),
and high growth (21x YoY).

This folder contains everything needed to produce, render, and
publish episodes end-to-end.

## Repository layout

```
fluentdrift/
|-- README.md                          This file
|-- .env.example                       Required API keys (copy to .env)
|
|-- channel-assets/
|   \-- brand-guide.md                 Name, colors, fonts, voice spec
|
|-- episode-01-plateau-breaker/        Episode 1, fully packaged
|   |-- script.md                      Narration script + timing + SSML
|   |-- storyboard.md                  16 scenes x 30 seconds
|   |-- assets.json                    Machine-readable asset manifest
|   |-- thumbnail.html                 Openable-in-browser mockup
|   |-- thumbnail-spec.md              Design spec + rationale
|   |-- metadata.json                  YouTube upload payload
|   |-- metadata.md                    Human-readable version
|   \-- community.md                   Pinned comments + polls
|
\-- scripts/
    |-- render_voice.py                ElevenLabs TTS runner
    \-- upload_youtube.py              YouTube Data API uploader
```

## Episode 1 production checklist

Run these in order. Each step has a dedicated file in
`episode-01-plateau-breaker/`.

1. **Read the script** (`script.md`) - confirm pacing, fix typos,
   re-record any line you want to rewrite
2. **Render the narration**:
   ```
   cp .env.example .env                 # then paste your keys
   pip install -r scripts/requirements.txt
   python scripts/render_voice.py \
       --episode episode-01-plateau-breaker
   ```
   Outputs: `episode-01-plateau-breaker/audio/narration.mp3`
3. **Gather B-roll** from `assets.json` - download each clip from
   the listed stock sites, drop into `episode-01-plateau-breaker/b-roll/`
4. **Edit the video** in your editor of choice. The storyboard is
   timecode-locked so you can paste clips straight onto the timeline
5. **Export the thumbnail** - open `thumbnail.html` in Chrome,
   screenshot at 1280x720, save as `thumbnail.png`
6. **Upload**:
   ```
   python scripts/upload_youtube.py \
       --episode episode-01-plateau-breaker \
       --video final-cut.mp4
   ```
   The script reads `metadata.json` and ships the video with the
   correct title, description, tags, chapters, and thumbnail

## Metrics to watch in the first 48 hours

| Signal                      | Target         | If below target      |
|-----------------------------|----------------|----------------------|
| First-30-second retention   | >= 70%         | Hook is weak         |
| Average view duration       | >= 55% of 8min | Pacing is too slow   |
| Comment-to-view ratio       | >= 1.5%        | Pinned CTA not firing|
| CTR (impressions -> views)  | >= 6%          | Thumbnail or title   |
| Affiliate-link clicks       | >= 0.8% of views| Description hierarchy|

## Next episodes in the content plan

The 30-idea content backlog is stored outside this repo
(Notion/Airtable recommended). Episodes 2-5 are already scripted
in outline form:

- **Ep 2:** Why You Still Translate in Your Head (3-Step Fix)
- **Ep 3:** 15 Phrases Real Americans Say (Textbooks Never Teach)
- **Ep 4:** Learn English With One Netflix Scene
- **Ep 5:** Job Interview English - STAR Answer Script

Each follows the same Problem-Solution hook pattern validated in
Episode 1.
