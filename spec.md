# Specification

## Summary
**Goal:** Enhance the admin dashboard with a character order save button, file upload support for images, a new Worldbuilding admin panel, and a dark theme across all admin UI.

**Planned changes:**
- Add a light blue "Save" button to AdminCharactersPanel that persists the drag-reordered character sequence to the backend, updating the public Characters section display order; button is hidden or disabled when no reordering has occurred
- Add drag-and-drop / file upload support to image fields in CharacterForm and ContentForm, accepting files up to 50 MB, converting to a usable URL that pre-fills the image URL field, and showing a preview thumbnail
- Add a "Worldbuilding" tab to the AdminDashboard sidebar and create an AdminWorldbuildingPanel with editable fields for clans (name, description, sigil), clan eye rules, power system, rank system, and Shiranagi family entries, with full create/update/delete support and backend persistence reflected on the public WorldbuildingSection
- Apply a dark color palette to the AdminDashboard, AdminSidebar, all admin panels, forms, modals, and inputs without affecting the public-facing site

**User-visible outcome:** Admins can reorder characters and save the new order, upload image files directly instead of only entering URLs, manage all worldbuilding content from a dedicated admin tab, and interact with a dark-themed admin dashboard throughout.
