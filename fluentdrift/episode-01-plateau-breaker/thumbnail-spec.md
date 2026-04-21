# Thumbnail Spec - Episode 1

## Output

- Size: **1280 x 720 px** (YouTube standard)
- Format: **PNG** (JPEG only if file size > 2MB)
- File: `thumbnail.png` in this folder

## How to export from `thumbnail.html`

1. Open `thumbnail.html` in Chrome
2. Open DevTools (Cmd+Opt+I / F12) -> Device Toolbar (Cmd+Shift+M)
3. Choose "Responsive" and set viewport to **1280 x 720**
4. Right-click the `.thumb` element in Elements panel ->
   "Capture node screenshot"
5. Save as `thumbnail.png`

Alternative: use a headless Chrome one-liner:
```
google-chrome --headless --disable-gpu --screenshot=thumbnail.png \
  --window-size=1280,720 thumbnail.html
```

## Design rationale

| Decision                       | Why                                             |
|--------------------------------|-------------------------------------------------|
| Left-aligned subject           | Mobile feed pushes title text to the right of the thumbnail; keeps both readable |
| Navy + gold (not red/yellow)   | 2026 meta - premium educators moved off MrBeast-red palette |
| Faceless mouth silhouette      | Complies with faceless-channel rules; viewer projects self |
| Gold burst breaking red ring   | Visual metaphor of breakthrough - readable in <1s |
| "BREAK THE PLATEAU" overlay    | Three power words, doesn't repeat title keyword |
| Red slash through "PLATEAU"    | Reinforces the break metaphor textually         |
| Red stamp "[X] B1"             | Audience-specific without echoing title         |
| 11.2:1 contrast on gold-on-navy| Passes mobile-in-sunlight legibility test       |

## A/B variant (for future episodes or re-tests)

- Alt subject: Silhouette head split half-brain / half-mouth
- Alt text: **"SPEAK, DON'T STUDY"**
- Test hypothesis: identity reframe vs. breakthrough frame
