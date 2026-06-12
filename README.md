# Guess XI: World Cup

A fast-launch browser/PWA football guessing game. Players get three daily World Cup-themed player puzzles, shown with generic national-colour shirts and clue reveals.

## Run locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Verify

```bash
npm test
npm run build
```

## Promo preview URLs

Promo preview mode is a hidden recording/testing helper. It does not affect the three daily games, stored daily progress, or recent-player cooldown history.

Set a local or Vercel environment variable:

```bash
NEXT_PUBLIC_PROMO_KEY=replace-me
```

Then open a URL with a player slug or accepted player name plus the key:

```text
https://guessxi.app?promoPlayer=bernardo-silva&promoKey=fake-preview-key
```

`previewKey` is also accepted as an alias for `promoKey`. If the key is missing/wrong, or the player is not found, the app ignores the promo parameters and runs the normal daily-random game.

## Notes

- No accounts, official logos, photos, badges, sponsors, or official kit designs.
- Daily progress is stored in localStorage and resets by local date.
- Player data lives in `lib/players.ts`.
- Google Sheet/player import expectations live in `lib/sheetSchema.ts`. `Exclude` is an optional first column; rows marked `X`, `TRUE`, or `Yes` are kept in source data but excluded from the playable daily pool. Add `Career Path` immediately before `Fact` in the sheet.
- Autocomplete uses `lib/guessOptions.ts`, which can include source rows and suggestion-only names that are not answer candidates.
- FIFA PDF squad suggestion extraction review lives at `data/extracted-fifa-squad-names-review.csv`.
- A paste-ready career path backfill is available at `data/career-path-sheet-backfill.csv`.
