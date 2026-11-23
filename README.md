# The Great Desert Race: badges and name registration

Static GitHub Pages site for the Great Desert Race LED game (DCT GITEX look). No server, no tracking, no stored data.

| Page | Purpose |
|------|---------|
| `/register/` | Phone page behind the registration QR: posts the typed name to the ntfy relay topic `desert-reg-<key>` (key comes after `#`). |
| `/tablet/` | Kiosk page for a registration tablet left open full screen: REGISTER -> the tablet camera reads a QR on the LED screen (that QR decides PLAYER 1 / 2 and the round's key) -> type name -> SUBMIT -> thank you -> back to REGISTER. Same relay topic as the phone page; no game build change. |
| `/badge1/` | 1st place badge (two-player race). |
| `/badge2/` | 2nd place badge (two-player race). |
| `/rank/` | Single-player rank badge (leaderboard rank). |

The badge pages read the player's name, overall leaderboard rank and stats from the link fragment
(`#n=<name>&r=<rank>&o=<total>&t=<seconds>&s=<km/h>&l=en|ar`), so GitHub never receives them, and draw the badge on a canvas
that the player can download as a PNG. English and Arabic. Fonts: TeX Gyre Heros (GUST licence) and IBM Plex Sans Arabic (OFL).

## Tablet kiosk (`/tablet/`)
Open https://thelostsun.github.io/desert-race/tablet/ in Chrome on the tablet, allow the camera once, then Chrome menu > Add to Home screen
(opens full screen from the icon). Each round the game makes new QR codes, so the tablet reads them off the LED screen with its camera.
Flow: REGISTER -> scan (the scanned QR decides the player and where the name goes) -> name -> SUBMIT -> thank you (6 s) -> REGISTER.
Guards:
- only Desert Race register codes count (badge codes / other QRs show a hint);
- both codes in view: only the code in the middle of the picture (inside the white frame) is taken, and only when it is clearly nearer than the other;
- a code that is already registered (by phone or tablet) is refused at scan time and again just before sending; after sending, the relay is read
  back and if another name for the same code landed first the tablet says so (the game keeps only the first name);
- 45 s scan limit, 60 s idle on the name screen, camera off whenever it is not scanning, Back / pinch-zoom / pull-to-refresh / long-press blocked,
  screen kept awake, page reloads itself after 6 h when idle.
Scanner: BarcodeDetector where available (Android Chrome), else jsQR (`assets/jsQR.min.js`, Apache 2.0), which scans whole / left / right /
centre / top / bottom of the picture in turn because it reads nothing when both codes are in view.
