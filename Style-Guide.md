Brand Vibe

Playful but modern — think Duolingo × Habitica.

Age range: 7–16 (avoid childish visuals; feel cool for teens).

Tone: Encouraging, short, positive. Emoji welcome, not overused.

Accessibility

WCAG AA contrast for text.

Focus states visible. All interactive elements keyboard/touch friendly.

Motion‑sensitive toggle to reduce animations.

Colors (tokens)
--bg: #0b0f14;            // deep slate (dark mode default)
--card: #121821;
--primary: #22c55e;       // green (success/progress)
--primary-contrast: #052e16;
--accent: #60a5fa;        // blue (info)
--warn: #f59e0b;          // amber (streaks)
--danger: #ef4444;        // red (errors)
--text: #e5e7eb;          // gray-200
--muted: #94a3b8;         // slate-400

(Provide light mode later; start dark for game vibe.)

Typography

Display: Inter or Outfit (600–800 for headings).

Body: 400–500. Line-height 1.3–1.5.

Use numerals with tabular figures for scores.

Layout & Components

Cards: rounded‑2xl, soft shadow, generous padding.

Buttons: solid primary for key actions; secondary outline for neutral.

Badges/Chips: for difficulty, frequency, streaks.

Progress Bars: thick, rounded, animated fill.

Avatar: circular with level ring; subtle glow on level‑up.

Motion & “Juice”

150–250ms ease for UI; 300–500ms for level‑up sequences.

Use particles/confetti sparingly for chore completion.

Prefer scale + rotate‑tiny + alpha combos; keep 60 FPS.

Iconography

Lucide set; simple line icons.

Use consistent stroke width.

Copy & Localization

NL first, EN second. Keep strings short and translatable.

Examples:

NL: "Klaar? Tik om te claimen!" → EN: "Done? Tap to claim!"

NL: "Nieuwe beloning" → EN: "New reward"

Empty States

Friendly mascot hint, 1–2 action buttons.

Example: "Nog geen klussen — voeg er een toe!" / "No chores yet — add one!"