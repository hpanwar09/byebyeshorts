# ByeByeShorts

Chrome extension that removes YouTube Shorts from your feed. No shorts, no distractions.

## What it hides

- Shorts shelf on homepage
- Shorts in search results
- "Shorts" link in sidebar
- Shorts tab on channel pages
- Individual video cards linking to `/shorts/`

## Install

### From source (any Chromium browser)

1. Clone this repo
2. Open `chrome://extensions` (or `edge://extensions`)
3. Enable **Developer mode**
4. Click **Load unpacked** → select the cloned folder
5. Open YouTube

### Toggle

Click the extension icon to turn hiding on/off. Your preference is saved.

## Permissions

- `storage` — saves your on/off preference
- `youtube.com` — content script runs only on YouTube

No data is collected. No network requests. Everything runs locally.

## License

MIT
