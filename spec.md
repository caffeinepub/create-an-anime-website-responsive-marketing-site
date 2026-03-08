# Whispers of the White Moon

## Current State
Full-stack anime promotion site with a React frontend and Motoko backend. The admin dashboard has tabs for Episodes, Characters, Content, Contact Requests, and Role Management. There is no "how did you find us" popup on first visit, and no corresponding admin tab.

## Requested Changes (Diff)

### Add
- A popup modal that appears once on first website visit asking "How did you find us?" with options: Google / AI, YouTube, Social Media, Friend / Word of Mouth, Reddit, TikTok, and Other.
- If "Other" is selected, a text input appears requiring the user to specify.
- Submission is stored on the backend (canister) with timestamp.
- Popup is dismissed after submission or if user closes it (shown only once per browser via localStorage).
- A new "Site Referrals" tab in the admin dashboard showing all submissions (source, custom text if "Other", timestamp), with ability to delete entries.

### Modify
- `main.mo`: Add `ReferralSource` type, `submitReferral` (public, no auth), `getReferrals` (admin-only), `deleteReferral` (admin-only) methods.
- `backend.d.ts`: Add corresponding TypeScript types and interface methods.
- `AdminDashboard.tsx`: Add `"referrals"` to `AdminSection` type and render the new panel.
- `AdminSidebar.tsx`: Add "Site Referrals" nav item.
- `App.tsx`: Import and render the new `ReferralPopup` component.

### Remove
- Nothing removed.

## Implementation Plan
1. Update `main.mo` with ReferralSource type and CRUD methods.
2. Update `backend.d.ts` to reflect new backend API.
3. Create `ReferralPopup.tsx` — modal with radio options + conditional "Other" text input, localStorage gate, submits to backend.
4. Create `AdminReferralsPanel.tsx` — table of all referral submissions with delete support.
5. Update `AdminDashboard.tsx` to add `"referrals"` section.
6. Update `AdminSidebar.tsx` to add the nav item.
7. Update `App.tsx` to include `<ReferralPopup />`.
