# Specification

## Summary
**Goal:** Update the Donation section to show new “Support Whispers Of The White Moon” copy and display the existing rewards tiers from site config.

**Planned changes:**
- Replace all existing content in the Donation section (`section id="donations"`, `frontend/src/components/RewardsSection.tsx`) with the provided donation intro text, including the specified emojis (🌙 🔥 💙), and add the “Rewards” heading.
- Add/format an informational Cash App donation block in the Donation section that displays “Donate Via Cash App”, “Send support to:”, and the handle “$WOTWM”.
- Render the five reward tiers in the Donation section using `animeSiteConfig.rewards.tiers` (`frontend/src/content/animeSiteConfig.ts`), showing each tier’s icon, name, donation range, and perks as bullet points, in config order.

**User-visible outcome:** Scrolling to the Donation section shows the new Support text and Cash App handle, followed by a “Rewards” heading and a tier list populated from the site configuration.
