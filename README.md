# Danveer & Harman Preet — Interactive Wedding Invitation

This folder is a complete static website. Open `index.html` locally or deploy the folder to GitHub Pages/Netlify/Vercel.

## Included
- `index.html` — all invitation sections and event details
- `style.css` — responsive design, animations, typography and layout
- `script.js` — door-opening sequence, music, falling petals, countdown, scratch-heart interaction and calendar files
- `assets/` — all reference-derived image crops plus the original reference images
- `assets/wedding-ambient.wav` — custom, royalty-free ambient wedding instrumental

## Invitation sequence
1. Tap to Open
2. Animated doors opening with “Opening the Doors to Our Story…”
3. Danveer & Harman Preet — Our Forever Begins
4. Scratch the Heart — reveals 23–25 October 2026
5. Date / Amritsar
6. Welcome
7. Countdown to 23 October 2026, 6:30 PM
8. Our Special Days
9. Family details
10. Sikh blessings / Mool Mantar

## Event details
### Shagun & Roka Ceremony
23 October 2026 — 6:30 PM
Regenta Central, Amritsar
A-275, East Mohan Nagar, Grand Trunk Road, Amritsar, Punjab 143001

### Anand Karaj
25 October 2026 — 11:00 AM
Sandoz Amritsar
12 Lawrence Road, beside Apsara Toys Centre, Dayanand Nagar, Amritsar, Punjab 143001

The “Navigate” buttons open Google Maps search for each venue.

## Calendar
The top calendar button downloads an `.ics` calendar containing both events. Each event card also has its own Add Calendar button.

## Music
Browsers generally block autoplay with sound. The invitation starts the music after the guest taps “Tap to Open”, and the floating music button can pause/resume it.

## GitHub Pages
1. Create a GitHub repository.
2. Upload everything inside this folder (not the ZIP itself).
3. Go to Settings → Pages.
4. Choose “Deploy from a branch”, select `main` and `/root`.
5. Save. GitHub will provide the public invitation URL.

## Important
The supplied reference artwork is used as the visual source for the background panels. The HTML/CSS layers the interactive text and controls over those panels so the invitation remains editable and functional.
