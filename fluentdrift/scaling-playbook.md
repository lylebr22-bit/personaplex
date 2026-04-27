# Scaling playbook - 0 to 100K subscribers

This is the week-by-week schedule. Stick to it. The single biggest
predictor of channel growth is consistency, not quality spikes.

## Week 1 - Foundation

| Day | Action                                                     |
|-----|------------------------------------------------------------|
| Mon | Render Episode 1 voice. Download B-roll. Begin edit.       |
| Tue | Finish Episode 1 edit. Export thumbnail. Render Short #1.  |
| Wed | Publish Episode 1 at 07:00 UTC. Publish Short #1 at 13:00. |
| Thu | Render Short #2. Publish at 07:00 UTC. Reply to comments.  |
| Fri | Render Short #3 voice + edit.                              |
| Sat | Publish Short #3. Pull analytics for Episode 1 cohort.     |
| Sun | Review week 1 stats. Adjust week 2 based on what worked.   |

**Targets by end of week 1:**
- Episode 1: 500+ views, 1.5%+ comment ratio
- Shorts combined: 5K+ views, 25%+ re-watch on at least one
- Subscribers: +50

## Week 2 - Volume

| Day | Action                                                     |
|-----|------------------------------------------------------------|
| Mon | Render Episode 2 voice. Use generate_short.py for Short #4.|
| Tue | Edit Episode 2. Edit Short #4. Render Short #5 voice.      |
| Wed | Publish Episode 2 + Short #4. Edit Short #5.               |
| Thu | Publish Short #5. Render Short #6.                         |
| Fri | Publish Short #6. Use generate_short.py for Shorts #16-17. |
| Sat | Edit + publish Short #16.                                  |
| Sun | Edit + publish Short #17. Pull weekly analytics.           |

**Targets by end of week 2:**
- 5 Shorts published this week (1 short/day cadence achieved)
- 1 long-form published
- Subscribers: +200 cumulative

## Week 3-4 - Cadence lock

Daily: 1 Short. Mon: 1 long-form. Use the production rhythm:

- **Sunday batch day**: render 7 Short voices in one ElevenLabs session
- **Monday edit day**: edit Episode + 2 Shorts in parallel
- **Tue-Sat**: publish 1 Short/day at 07:00 UTC, monitor + reply

**Targets by end of week 4:**
- 28 Shorts + 4 Episodes total
- 5K subscribers
- 1 affiliate sale or Patreon supporter

## Week 5-8 - Optimize

Now you have data. Stop guessing, start cutting.

**What to keep:**
- Any Short with re-watch >25% gets a sequel within 7 days
- Any long-form with AVD >55% gets a follow-up Episode

**What to kill:**
- Any Short with re-watch <12% after 48h: do not repeat that
  format
- Any Episode with first-30s retention <50%: rewrite hook
  template

**What to add:**
- Apply for sponsor deals once at 5K subs (use Phase 3 outreach
  templates from monetization plan)
- Launch the shadowing pack ($19 digital product) at 8K subs
- Open Discord at 10K subs ($9/mo)

**Targets by end of week 8:**
- 60+ Shorts + 8 Episodes published
- 15-25K subscribers
- $1K-3K monthly revenue across affiliates + product + sponsor

## Week 9+ - Scale

| Tier | Cadence                          | Required tools                  |
|------|----------------------------------|---------------------------------|
| Solo | 7 Shorts/wk + 1 Episode/wk       | Existing repo                   |
| Plus | 14 Shorts/wk + 2 Episodes/wk     | Hire 1 editor or ai auto-cutter |
| Pro  | 21 Shorts/wk + 3 Episodes/wk     | Editor + thumbnail designer     |

**Targets by end of week 12:**
- 100K subscribers
- $5K-15K monthly revenue
- YPP enabled, ad revenue is 20-30% of total (rest is owned channels)

## Daily ops (every single day, 30 min)

| Time | Action                                                    |
|------|-----------------------------------------------------------|
| 07:15| Confirm scheduled upload went live                        |
| 08:00| Reply to first 30 minutes of comments (heart + reply)     |
| 12:00| Check first-2-hour retention on the morning upload        |
| 18:00| Reply to next 20 comments. Reshare top fan comments.      |
| 22:00| Schedule next morning's upload                            |

Skipping the comment ops is the single most common failure mode
for solo creators. The algorithm reads "creator engagement" as a
ranking signal. 30 min/day of comment ops outperforms 30 extra
min of editing.

## Failure mode protocol

If after week 6 you are below 3K subscribers:

1. The hook template is wrong. Rewrite it using the top 5
   competitors' patterns.
2. The thumbnail style isn't working. Switch to higher-contrast
   testing.
3. The publish time is wrong. Test 06:00 UTC vs 14:00 UTC.

Do not blame the algorithm. The algorithm did not change. Something
in the funnel did.

## When you're ready to spin up a second channel

Wait until FluentDrift hits 25K+ subscribers. Then:

- Pick from the high-leverage parallel niches (AI for ESL, finance
  for non-natives, business English)
- Reuse this entire repo as the template
- Copy fluentdrift/ to fluentdrift-{niche}/ and swap brand-guide.md
- Same scripts, same workflow, different audience
