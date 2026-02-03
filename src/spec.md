# Specification

## Summary
**Goal:** Remove Sensei Kuroshi Shirogane’s age from character content and ensure the UI only shows age when it exists.

**Planned changes:**
- Update `frontend/src/content/animeSiteConfig.ts` to remove Kuroshi Shirogane’s `age: 13` value and leave him with no age value (nothing that would render).
- Update `frontend/src/components/CharactersSection.tsx` to conditionally render the age label/value only when a character has a valid age, omitting the entire age portion (and its separator) when missing while keeping other metadata (clan, height, rank) intact.

**User-visible outcome:** Kuroshi Shirogane’s character card no longer shows any age text, while other characters that have ages continue to display them normally without formatting artifacts.
