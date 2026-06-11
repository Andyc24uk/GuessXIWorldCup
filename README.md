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

## Notes

- No accounts, official logos, photos, badges, sponsors, or official kit designs.
- Daily progress is stored in localStorage and resets by local date.
- Player data lives in `lib/players.ts` and is intentionally small for MVP testing.
