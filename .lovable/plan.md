

## Clean up duplicate sidebar entries

Currently the admin sidebar shows two "Testimonials" links and two image-related links ("Images" and "Gallery"). I'll remove the duplicates from the top "main" section and keep only the Website Content (CMS) versions.

### Changes

**`src/components/admin/AdminSidebar.tsx`** — remove these two entries from the `mainItems` array:
- `Testimonials` → `/admin/testimonials`
- `Images` → `/admin/images`

The remaining main items will be: Dashboard, Inquiries, Admissions, Chatbot Engagement.

The Website Content group keeps both:
- `Testimonials` → `/admin/content/testimonials`
- `Gallery` → `/admin/content/gallery`

### Routes & files

The underlying pages (`src/pages/admin/Testimonials.tsx`, `src/pages/admin/Images.tsx`) and their routes in `src/App.tsx` will be left in place — only the sidebar links are removed, so any existing bookmarks still work but the duplicates disappear from navigation. No other files need changes.

