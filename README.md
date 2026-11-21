# The Great Desert Race: badges and name registration

Static GitHub Pages site for the Great Desert Race LED game (DCT GITEX look). No server, no tracking, no stored data.

| Page | Purpose |
|------|---------|
| `/register/` | Phone page behind the registration QR: posts the typed name to the ntfy relay topic `desert-reg-<key>` (key comes after `#`). |
| `/badge1/` | 1st place badge (two-player race). |
| `/badge2/` | 2nd place badge (two-player race). |
| `/rank/` | Single-player rank badge (leaderboard rank). |

The badge pages read the player's name, overall leaderboard rank and stats from the link fragment
(`#n=<name>&r=<rank>&o=<total>&t=<seconds>&s=<km/h>&l=en|ar`), so GitHub never receives them, and draw the badge on a canvas
that the player can download as a PNG. English and Arabic. Fonts: TeX Gyre Heros (GUST licence) and IBM Plex Sans Arabic (OFL).
