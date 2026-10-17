# Thumbnail Engine

A single-page tool for making thumbnails and covers for YouTube, Instagram and TikTok. Open `index.html` in a browser; there is nothing to install.

## How to use it

1. **Type a request** like `YouTube video: 5 mistakes that kill small businesses in Kuwait, red warning style` and press **Build from request**. The engine picks the platform, layout, colors and the big words from what you typed. Arabic requests produce Arabic, right-to-left thumbnails set in the Cairo font.
2. When it runs inside Claude, **Ask Claude for 3 ideas** returns three different concepts. Click one to apply it.
3. Adjust the words, colors, font and photo. Upload your own photo; a cut-out PNG with a transparent background gets a white sticker outline.
4. Turn on **Show platform buttons & crops** to see what YouTube, TikTok and Instagram cover or crop.
5. Check the **Click check** score. Then save one thumbnail, or every platform at once as a `.zip`.

## Platforms

| Platform | Size | Notes |
|---|---|---|
| YouTube video | 1280 × 720 | JPG kept under 2 MB; bottom-right kept clear for the duration badge |
| YouTube Shorts | 1080 × 1920 | Text kept off the right button rail and the bottom title |
| TikTok cover | 1080 × 1920 | Top bar, right rail and caption zones marked; profile grid crops to 3:4 |
| Instagram Reel cover | 1080 × 1920 | Profile grid shows the center 1080 × 1440 |
| Instagram post | 1080 × 1350 | 3:4 grid trims about 34 px per side |
| Instagram square | 1080 × 1080 | 3:4 grid trims 135 px per side |
| Instagram Story | 1080 × 1920 | Name bar and reply bar zones marked |

## Styles

| Style | Use it for |
|---|---|
| Face + bold words | Default high-CTR layout: one expressive face and 2–4 huge outlined words |
| Big number | Lists, money, results ("5 MISTAKES", "50,000 KD") |
| Versus / before-after | Comparisons; the "before" side is shown in grayscale |
| Circle & arrow | Curiosity: point at the detail the viewer must click to understand |
| Question hook | A short question on bright bands |
| Executive | Business, finance, government and leadership topics in the brand's emerald and gold |
| Bold captions | TikTok/Reels-native caption bubbles over a full photo |
| Quote card | Instagram posts and book quotes |

## Research behind the rules

- **Faces with clear emotion.** One analysis reports about 6.8% CTR for thumbnails with faces against 4.1% without ([vidIQ](https://vidiq.com/blog/post/youtube-custom-thumbnails-ctr/), [EntreResource](https://entreresource.com/youtube-thumbnail-best-practices/)).
- **3–5 words.** Thumbnails with 1–5 words beat those with 11+ ([Unilink](https://www.unilink.us/blog/youtube-thumbnail-design-2026)).
- **Thumbnail and title work as one unit.** The thumbnail raises the question and the title answers it ([WaveGen](https://wavegen.ai/blog/youtube-thumbnail-best-practices)).
- **Contrast in color and in idea.** Examples are $1 vs $1M and big vs small. Yellow, red and blue dominate top channels ([thumbfa.st](https://thumbfa.st/posts/ai-youtube-thumbnails-what-top-creators-do-differently), [Tubecore](https://tubecore.xpanddigital.io/blog/youtube-thumbnail-examples-top-creators)).
- **Heavy text with a thick dark outline** on a saturated background ([Touhfa](https://touhfa.art/blog/thumbnails/mrbeast-thumbnail-font-guide/)).
- **Platform crops and safe zones** come from [Hopper HQ](https://www.hopperhq.com/blog/instagram-reel-size/), [Oktopost](https://www.oktopost.com/blog/instagram-grid-size-guide/), [Quso](https://quso.ai/blog/tiktok-dimensions) and [HeyOrca](https://www.heyorca.com/blog/tiktok-media-specs-best-practices-2026).

Most of these sources are creator-tool and marketing blogs. Treat exact percentages as directional, and use YouTube's **Test & Compare** to check real results on your channel.
