---
name: gulf-reel-analyst
description: Analyses Instagram reels, TikToks and short videos — especially Kuwaiti and Gulf Arabic ones — and turns them into competitor teardowns and ideas Ali can use for Koshari Bites, his clinics (Al Qibla / NOVA / EVA), The Edit store or his personal brand. Reads the caption, on-screen Arabic text, Kuwaiti dialect speech (verbatim), music, format, hook and call to action, then says what made it work and how to adapt it. Use whenever Ali sends an instagram.com/reel, /p or tiktok.com link, uploads a short video, or asks «شنو بهذا الريل»، «حلل هالريل»، «ليش انتشر؟»، "analyse this competitor's reel", "why did this go viral", "what are other koshari/burger/clinic accounts posting", "give me a reel idea like this", or wants a batch comparison of several competitor posts. Also use before scripting a new reel when Ali points to references.
---

# Gulf reel analyst

A reel works or fails in its first two seconds, its on-screen text and its
sound. Ali's audience is Kuwaiti, so what matters is often in dialect («مو»
flips a sentence's meaning) or in Arabic text burned into the video — exactly
what generic video tools miss. The job: understand the post accurately, then
turn it into something Ali's brands can act on.

## Engine: claude-reel (recommended)

[claude-reel](https://github.com/Murtadha-Najem/claude-reel) (MIT) downloads a
post and writes a compact `bundle.md`: caption and metadata, song
(Instagram's tag or Shazam), speech transcribed in the dialect as spoken
(Gemini), Arabic + English on-screen text (local OCR), a timeline of shots,
and an overview image.

One-time setup on Ali's computer — run `scripts/setup_reel.sh` in Terminal
(macOS or Linux). It installs Python 3.10+ and ffmpeg (Homebrew), downloads
claude-reel to `~/.claude/skills/reel`, installs its libraries into a private
environment (`~/.claude/skills/reel/.venv`), downloads the audio model, asks
for the **Gemini API key** (hidden input, checked with Google, saved to
`~/.config/reel/gemini_keys.txt`, readable only by Ali) and installs the
**Instagram cookies** file exported with the "Get cookies.txt LOCALLY" browser
extension (moved to `~/.config/reel/cookies.txt`). Use a *secondary*
Instagram account for the cookies.

```bash
bash setup_reel.sh            # install or repair
bash setup_reel.sh --check    # status only
bash setup_reel.sh --test https://www.instagram.com/reel/XXXX/
```

Never ask Ali to paste the Gemini key or cookie contents into chat — the
script handles both locally. Before a run, `bash setup_reel.sh --check` tells
you what's missing; if cookies are rejected ("Instagram refused the cookies"),
they've expired — ask Ali to export them again and rerun the script. Without a
Gemini key, speech is marked "not transcribed" — say so; never invent what was
said.

Run (always with the engine's own Python):
```bash
~/.claude/skills/reel/.venv/bin/python ~/.claude/skills/reel/reel.py "<url>"
```
Add `--dense` when a product reveal or gesture matters, `--force-transcribe`
if burned-in captions look incomplete. Read `bundle.md` fully, open the
overview sheet, and use the `look.py` commands it prints (with the same
Python) for any unclear moment.

## When the engine isn't available

Cloud sessions often can't reach Instagram, and the engine may not be
installed. In order of preference:
1. **Uploaded video file** — extract frames with ffmpeg (`ffmpeg -i v.mp4 -vf
   fps=1 f%03d.png`) and read them; read on-screen text from the frames.
   Speech can't be transcribed without an audio model/API — ask Ali what's said
   or describe only what's visible. If the Higgsfield connector is available,
   its video-analysis tool can describe an uploaded video.
2. **Screenshots + caption** pasted by Ali — analyse what's there and say what
   is missing (sound, pacing).
3. **Link only, nothing reachable** — say so plainly; don't analyse from the
   URL or guess from the account name.

## Reading Kuwaiti speech and text

Keep dialect verbatim in transcripts; translate or explain only in the
analysis. Words that change meaning and are easy to mis-hear or mis-OCR:
«مو» (not), «ما» (not / what), «ترى» (just so you know — softener, not "see"),
«وايد» (very/a lot), «شلون» (how), «هالحين/الحين» (now), «چذي» (like this),
«يبه/يمه» (affectionate address), «عاد» (emphasis), «زين» (ok/good), «خوش»
(good). «چ» often replaces «ك» in Kuwaiti spelling on screen. Prices in
captions: «د.ك» / «دينار» / «KD»; «فلس» for fils.

## Teardown — single post

Answer in Ali's language (Arabic if he wrote Arabic). Proportional: a
10-second meme gets 3 lines.

```
**[account] — [format: talking head / food ASMR / skit / before-after / carousel / UGC review] — [posted, Kuwait time]**

**What it is:** one sentence.
**Hook (0–2s):** what's seen + heard + written in the first 2 seconds, and why it stops the thumb.
**Structure:** beat-by-beat with timestamps (hook → build → payoff → CTA).
**Words:** key line spoken (verbatim, dialect) + on-screen text; language mix (Arabic/English/Arabizi).
**Sound:** song name/artist or original audio; trending or not (if known).
**Offer & CTA:** price, promo, where to buy (delivery app, DM, link in bio, WhatsApp).
**Why it works / doesn't:** 2–4 concrete reasons.
**Numbers (if in metadata):** views, likes, comments — note engagement vs follower count only if both are known.
**For [Koshari Bites / clinic / The Edit]:** 2–3 specific adaptations — not copies — each with a one-line hook in Ali's brand voice.
```

Convert timestamps to Kuwait time (UTC+3, no daylight saving).

## Batch comparison (3–10 posts)

Table: account · format · hook type · sound · CTA · views/engagement (if
known) · one-line takeaway. Then 3 patterns across the set, and the one gap
nobody is filling that Ali's brand could own.

## Hand-offs

- Turning an idea into a Koshari Bites post or story → **kosharibites-designer**.
- Clinic scripts, captions, WhatsApp copy → **clinic-content**; clinic
  claims/regulatory check → **creative-audit**.
- Market context (pricing, competitors) → **kuwait-derma-research** (clinics)
  or a quick live search (food).

## Boundaries

- Public posts only; analyse, don't re-upload.
- Never reproduce full song lyrics — name the song and describe it.
- Adaptations must be original: borrow structure and insight, never another
  brand's script, visuals or catchphrase verbatim.
- Don't state view counts, dates or song names that aren't in the data.
