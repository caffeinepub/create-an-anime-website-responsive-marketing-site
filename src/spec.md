# Specification

## Summary
**Goal:** Update the Hero section background to a new anime-style panoramic scene featuring a moonlit waterfall on one side and a volcano with the sun on the other.

**Planned changes:**
- Add a newly generated hero background image asset under `frontend/public/assets/generated/` with the specified filename.
- Update `frontend/src/components/HeroSection.tsx` to reference the new background image path instead of the current `anime-hero-bg.dim_1920x1080.png`, keeping full-screen cover behavior and existing readability overlay.

**User-visible outcome:** The landing page Hero displays the new split-scene background (moon + waterfall vs. volcano + sun) while remaining full-screen with readable text.
