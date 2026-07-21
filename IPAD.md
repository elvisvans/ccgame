# Play Happy Buddy on iPad

## Quick start (same Wi‑Fi)

1. On the PC, double‑click **`start-ipad.bat`** in this folder  
   (or run: `python -m http.server 8080`).
2. Note the IP shown, e.g. `192.168.1.20`.
3. On iPad **Safari**, open: `http://192.168.1.20:8080`
4. Tap **Share** → **Add to Home Screen** → open the icon.

Keep the PC window open while playing. Music and voice need one tap first (iOS rule).

## Why a server?

PWA offline cache and reliable audio work best over **http://** or **https://**, not `file://`.

## Permanent link (optional)

Upload this whole `happy-buddy` folder to:

- Netlify Drop  
- Cloudflare Pages  
- GitHub Pages  

Then open the HTTPS URL on iPad and **Add to Home Screen**.

## Offline

After you open the game once over the network, the service worker caches core files so it often works offline from the Home Screen icon.

## Files added for iPad / PWA

| File | Purpose |
|------|--------|
| `manifest.webmanifest` | App name, icons, standalone display |
| `sw.js` | Offline cache |
| `assets/icons/*` | Home Screen icons |
| `start-ipad.bat` | One‑click local server |
