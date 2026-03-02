# Specification

## Summary
**Goal:** Allow admins to drag-and-drop characters into a custom display order within the Admin Dashboard, with the order persisted to the backend.

**Planned changes:**
- Add a `displayOrder` field to the character data model in the backend.
- Add a `reorderCharacters` endpoint (admin-only) that accepts an ordered array of character IDs and updates their `displayOrder` values.
- Update the `getCharacters` query to return characters sorted by `displayOrder` ascending.
- Add drag-and-drop reordering to the `AdminCharactersPanel` component with a visible drag handle on each character row/card.
- Implement optimistic UI updates on drag-and-drop, followed by a backend persist call and React Query cache invalidation.

**User-visible outcome:** Admins can drag characters into any desired order in the Admin Dashboard; the order is saved and persists across page refreshes. All existing edit and delete actions continue to work normally.
