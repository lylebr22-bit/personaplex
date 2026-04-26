# FluentDrift Shorts

Three publish-ready vertical Shorts engineered as the top-of-funnel
for FluentDrift Episode 1. Each Short is cut from one Pattern
Interrupt in the long-form storyboard, then re-built with the 5
re-watch mechanics:

1. **Seamless loop** - last frame matches first
2. **Hidden detail** - only visible on watch #2
3. **Punchline reveal** - last 3s recontextualizes opening
4. **Information density** - too much value to absorb once
5. **Visual rhythm** - cuts and captions on the audio beat

Target: **AVD over 90%, re-watch rate over 25%.**

## Folder layout

```
shorts/
|-- README.md                              this file
|
|-- short-01-speak-30-seconds/             Pattern Interrupt 1 derived
|   |-- script.md                          spoken lines + cadence
|   |-- timeline.json                      machine-readable beat track
|   |-- captions.srt                       1-2 word pop captions
|   \-- metadata.json                      YouTube upload payload
|
|-- short-02-cambridge-proved/             Pattern Interrupt 2 derived
|   \-- (same files)
|
\-- short-03-mei-7-years/                  Pattern Interrupt 3 derived
    \-- (same files)
```

## Production flow

1. **Render the voice**:
   ```
   python scripts/render_short.py --short shorts/short-01-speak-30-seconds
   ```
   Outputs: `shorts/<short>/audio/voice.mp3`

2. **Build the timeline in CapCut / DaVinci**:
   - Import `timeline.json` as a reference
   - Each beat object = one clip on the timeline
   - Use CapCut "Beat Sync" feature, then snap clips to detected beats
   - Hardcode captions from `captions.srt` (YouTube auto-captions are too
     slow for Shorts; pop-caption styling lifts retention 8-12%)

3. **Export at 1080x1920, 30fps, H.264, MP4** - YouTube's preferred
   Shorts spec

4. **Upload via Studio (manual is faster than API for Shorts)**:
   - Title from `metadata.json`
   - Description: short + hashtags from metadata
   - Tag: "Shorts" automatically applied because of vertical aspect
   - Toggle "Altered or synthetic content" since voice is AI-generated

## Launch schedule

| Day | Drop                  | Strategy                                  |
|-----|-----------------------|-------------------------------------------|
| T+0 | Episode 1 (long-form) | Main publish at 07:00 UTC                 |
| T+0 | Short #1              | 6 hours after long-form, captures spillover|
| T+1 | Short #2              | Morning of day 2, pulls fresh viewers     |
| T+3 | Short #3              | Mid-week, re-triggers algorithm           |

Each Short pinned-comment links back to the long-form via the comment
mechanic ("Full method in my latest video"). Do not link in the Short
itself - YouTube down-weights Shorts with outbound CTAs in-frame.

## Re-watch checklist (run before every export)

- [ ] First frame and last frame look identical
- [ ] Hidden detail planted (text, audio, or background element)
- [ ] Final 3 seconds reframe the opening
- [ ] Captions pop on the beat, not fade in
- [ ] No silent gaps over 0.4s
- [ ] Voice trimmed of breath pauses (Shorts demand tighter cadence)
- [ ] Sound design layered: at least 3 SFX events
- [ ] Disclosed as "Altered or synthetic" at upload

## Scaling playbook (after these 3 ship)

| Week  | Cadence              | Source                                   |
|-------|----------------------|------------------------------------------|
| 1-2   | 3 Shorts/week        | Cut from each long-form episode          |
| 3-4   | 5 Shorts/week        | Add original Shorts written from scratch |
| 5-8   | 7 Shorts/week (1/day)| Establish daily algorithm signal         |
| 9+    | 10-14 Shorts/week    | Two batches/day at peak times            |

Use this folder as the template. Each new Short is one new subfolder,
same 4 files, same render command.
