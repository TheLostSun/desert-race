# The Great Desert Race: badges and name registration

Static GitHub Pages site for the Great Desert Race LED game (DCT GITEX look). No server, no tracking, no stored data.

| Page | Purpose |
|------|---------|
| `/register/` | Phone page behind the registration QR: posts the typed name to the ntfy relay topic `desert-reg-<key>` (key comes after `#`). |
| `/tablet/` | Kiosk page for a registration tablet left open full screen: type name, pick PLAYER 1 / 2, point the tablet camera at that player's QR on the LED screen, the name is sent to the same relay topic; thank-you screen, then back to the start. No game build change needed. |
| `/badge1/` | 1st place badge (two-player race). |
| `/badge2/` | 2nd place badge (two-player race). |
| `/rank/` | Single-player rank badge (leaderboard rank). |

The badge pages read the player's name, overall leaderboard rank and stats from the link fragment
(`#n=<name>&r=<rank>&o=<total>&t=<seconds>&s=<km/h>&l=en|ar`), so GitHub never receives them, and draw the badge on a canvas
that the player can download as a PNG. English and Arabic. Fonts: TeX Gyre Heros (GUST licence) and IBM Plex Sans Arabic (OFL).

## Tablet kiosk (`/tablet/`)
Open https://thelostsun.github.io/desert-race/tablet/ in Chrome on the tablet, allow the camera once, then Chrome menu > Add to Home screen
(opens full screen from the icon). Each round the game makes a new QR, so the tablet reads it from the LED screen with its camera.
Guards: only Desert Race register codes for the chosen player are accepted (the other player's code, badge codes and other QRs show a hint);
a player who is already registered for the round (by phone or tablet) is not sent twice; one send per code; 45 s scan limit; the camera stops
when it is not scanning; idle name cleared after 90 s; Back button, pinch-zoom, pull-to-refresh and long-press are blocked; screen kept awake.
Scanner: the browser's BarcodeDetector where available (Android Chrome), else jsQR (`assets/jsQR.min.js`, Apache 2.0, `assets/LICENSE-jsQR.txt`),
which scans whole / left / right / centre / top / bottom of the picture in turn because it reads nothing when both codes are in view.
