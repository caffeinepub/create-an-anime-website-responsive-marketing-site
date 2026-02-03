# Specification

## Summary
**Goal:** Restore the public site hero section background to the exact previously-used background artwork (reverting from the current image).

**Planned changes:**
- Update `frontend/src/components/HeroSection.tsx` to stop using `/assets/generated/anime-hero-bg-moon-waterfall-volcano-sun.dim_1920x1080.png` and reference the previously-used hero background image instead.
- If the previously-used hero background asset is missing from `frontend/public/assets` (or `frontend/public/assets/generated`), restore/re-add it so it is served as a static frontend asset.

**User-visible outcome:** The site hero section displays the same background artwork that was used before the most recent background change, and the hero background loads correctly without affecting other sections.
