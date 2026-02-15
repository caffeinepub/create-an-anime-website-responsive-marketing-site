# Specification

## Summary
**Goal:** Add a dedicated “Clans” section to the main page featuring clan lore and sigil images, and make it reachable from the top navigation.

**Planned changes:**
- Create a new standalone main-page section with id="clans" and a visible header “Clans”, including the provided intro paragraph and seven clan entries (Moon, Sun, Fire, Water, Lightning, Earth, Balance) with verbatim descriptions.
- Insert the Clans section into the top-level page flow in `frontend/src/App.tsx` as its own sibling section (not inside the existing Worldbuilding section).
- Update `frontend/src/components/TopNav.tsx` to add a “Clans” link that smooth-scrolls to `#clans` on desktop and mobile (and closes the mobile menu after selection).
- Render a sigil image for each clan entry from `/assets/generated/*.png` with appropriate alt text (e.g., “Moon Clan sigil”), ensuring the layout remains responsive.

**User-visible outcome:** Visitors can navigate to a new “Clans” section from the top menu, read lore for seven clans, and see a corresponding sigil image for each clan.
