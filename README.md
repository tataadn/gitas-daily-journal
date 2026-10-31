# 🌸 Gita's Daily Journal

*Bahasa Indonesia: see [README.id.md](README.id.md).*

A personal diary web app built with plain **HTML, CSS, and JavaScript** (plus Bootstrap). No database and no server needed. It looks like an open book in a pastel blue, white, and lightly floral theme, with a cover that opens and a YouTube song attached to each entry.

## Features

- **Book cover** with an "Open Diary" button and an opening animation. A "Close book" button returns to the cover.
- **Write entries**: date, title, body text, and a mood (emoji picker).
- **Table of contents** on the left page, newest first, with search across titles and text.
- **Song of the day**: paste a YouTube link and it plays as audio only (no video shown), with play/pause, a seek slider, and volume.
- **Save, edit, and delete** entries.
- **Backup and Restore** through a JSON file.
- **Light and dark mode** (🌙/☀️ button). Your choice is remembered in the browser.
- **Responsive**: on phones the book becomes a single page with "Contents" and "Write" tabs.

## Project structure

```
diary-bootstrap/
├── index.html           # page structure + cover (SVG)
├── style.css            # theme, colors, and book styling
├── script.js            # all application logic
├── favicon.svg          # browser tab icon
├── favicon-32.png       # fallback icon
├── apple-touch-icon.png # icon for the iPhone/iPad home screen
├── icon-192.png         # spare icon (for a future PWA)
├── README.md            # this file (English)
└── README.id.md         # Indonesian version
```

## Getting started

An **internet connection is required**, because Bootstrap, fonts, and the YouTube player load from CDNs.

**Run locally (a live server is recommended)**
1. Open this folder in VS Code.
2. Install the **Live Server** extension, then right-click `index.html` and choose *Open with Live Server*.
3. Or use the terminal: `npx serve` or `python -m http.server 8000`, then open `http://localhost:8000`.

> Don't open `index.html` by double-clicking it (a `file://` address). The YouTube player often refuses to work that way.

**Deploy (Netlify example)**
1. Go to <https://app.netlify.com/drop>.
2. Drag this whole folder onto the page.
3. You get an address like `https://your-site.netlify.app`.

It also works on GitHub Pages, Vercel, or any other static hosting.

## How to use

1. Click **✨ Open Diary** (labeled "Buka Diary") on the cover.
2. Click **＋ New page** ("Halaman baru"), then fill in the date, title, text, and mood.
3. (Optional) Paste a YouTube link into **Song of the day** and click **▶ Play**.
4. Click **💾 Save**.
5. To reopen an old entry, click its title in the **Table of contents**.

Recognized YouTube link formats: `youtube.com/watch?v=...`, `youtu.be/...`, and `youtube.com/shorts/...`.

> The interface itself is currently in Indonesian. Labels live in `index.html` and `script.js` if you want to translate them.

## About data storage (important)

Entries are saved in the browser's **localStorage** (key `buku-harianku-v1`). This means:

- Data survives a refresh, closing the tab, or restarting the computer.
- Data is **tied to one browser on one device and one address**. A diary written on your phone won't show up on your laptop, and `localhost:5500` counts as different from `127.0.0.1:5500`.
- Data **can be lost** if you clear site data or cookies, use incognito mode, or the browser cleans up storage.
- Data is **not encrypted**. Anyone who can open the same browser can read it.

**So back up regularly with ⬇ Backup.** The `diary-backup-DATE.json` file can be kept on Google Drive, a flash drive, and so on. To bring entries back, click **⬆ Restore** and choose that file. Restore only adds entries that don't exist yet, so existing entries are never overwritten. This is also how you move your diary between devices.

## Notes on YouTube songs

- Songs **can't autoplay** when the page loads (a browser rule), so you need to click Play first.
- An internet connection is needed to play songs. Diary text can still be read offline.
- Some videos can't be played outside YouTube (common with official label music videos). If you see that message, try another version of the song (audio, lyrics, or a cover).
- The video is hidden off-screen and only the sound is used. That's fine for a personal diary, but if you publish this app to a wide audience, check YouTube's terms about how the player must be displayed.

## Customization

- **Theme colors**: edit the variables at the top of `style.css`. The `:root` block is for light mode and `[data-bs-theme="dark"]` is for dark mode.
- **Diary title**: change it in `<title>`, in the cover SVG text (`Gita's` and `Daily Journal`), and in the header title in `index.html`.
- **Mood options**: edit the emoji list in `const MOODS` in `script.js`.
- **Cover art**: the whole cover is an inline SVG in `index.html` (the `SAMPUL` section, which means "cover"), so colors and ornaments can be edited directly.

## Built with

- HTML, CSS, and JavaScript (no framework, no build step)
- [Bootstrap 5.3.3](https://getbootstrap.com/) via CDN
- Google Fonts: Dancing Script, Caveat, Lora
- [YouTube IFrame Player API](https://developers.google.com/youtube/iframe_api_reference) for songs
- localStorage for storage

A modern browser is recommended (recent Chrome, Edge, Firefox, or Safari).

## Troubleshooting

| Problem | Cause and fix |
| --- | --- |
| Song doesn't appear or has no sound | Open the app over `http://` (live server or hosting), not `file://`. Make sure you're online and click the Play button. |
| "Video can't be played" message | The video owner blocks playback outside YouTube. Try another link. |
| Entries are gone | Browser data was probably cleared or the address changed. Use Restore with your latest backup file. |
| Layout looks broken or fonts look plain | Bootstrap and Google Fonts haven't loaded. Check your internet connection. |
| Tab icon hasn't changed | The browser cached the old icon. Try a hard refresh (`Ctrl + Shift + R`). |
