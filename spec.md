# Specification

## Summary
**Goal:** Build a secure admin dashboard at `/admin` for managing anime content (episodes, characters, general content) with Internet Identity authentication, completely separate from the public website.

**Planned changes:**
- Add a `/admin` route that requires Internet Identity login and admin role verification; unauthenticated or non-admin users are blocked
- Add backend stable storage and admin-only CRUD functions for episodes (title, description, video URL, thumbnail URL, episode/season number)
- Add backend stable storage and admin-only CRUD functions for characters (name, bio, image URL, weapon, ability, role, trait tags)
- Add backend stable storage and admin-only CRUD functions for general content entries (type/category, title, body, optional image URL)
- Migrate stable backend state to include new variables while preserving existing contact request and admin role data
- Add Episodes management panel in the admin dashboard with list view and create/edit/delete form
- Add Characters management panel in the admin dashboard with list view and create/edit/delete form
- Add General Content management panel in the admin dashboard with list view and create/edit/delete form by category
- Design the admin dashboard with a dark-themed control panel aesthetic, sidebar navigation (Episodes, Characters, Content, Contact Requests, Role Management), and styling clearly distinct from the public site

**User-visible outcome:** Admins can log in via Internet Identity, access the `/admin` dashboard, and fully manage episodes, characters, and general site content (create, edit, delete) through a professional dark-themed control panel with sidebar navigation, while the public website remains unchanged.
