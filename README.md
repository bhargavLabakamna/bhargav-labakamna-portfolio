# Bhargav Labakamna — Portfolio

A premium, dark, animated developer portfolio built for a PHP / Laravel developer.
React + Vite, React Router, Framer Motion, Lucide icons.

## Getting started

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

To build for production:

```bash
npm run build
npm run preview
```

## Project structure

```
src/
├── assets/
│   └── images/          # profile-placeholder.svg lives here
├── components/           # reusable UI: Header, Footer, cards, cursor, loader, etc.
├── pages/                 # one folder per route
├── data/                  # all editable content (profile, skills, projects, services…)
├── hooks/                 # small reusable hooks (reduced motion, pointer type)
├── App.jsx                # routes + page transitions
├── main.jsx                # entry point
├── index.css                # base design tokens and global styles
└── ui.css                   # portfolio theme, responsive styling, and motion
```

## Editing your content

Everything you're likely to want to change lives in `src/data/`:

- `profile.js` — name, title, about text, contact details, stats
- `navigation.js` — header / mobile nav links
- `skills.js` — skill categories and cards
- `experience.js` — work history timeline
- `projects.js` — case studies shown on the Projects page and detail pages
- `services.js` — services grid
- `process.js` — the "how I work" steps
- `social.js` — GitHub / LinkedIn / Instagram links (currently `#` placeholders)

You generally won't need to touch component code to update content.

## Replacing the profile photo

The About page uses `src/components/ProfileFrame/ProfileFrame.jsx`, which imports:

```js
import profileImage from '../../assets/images/profile-placeholder.svg'
```

To use your own photo:

1. Add your photo to `src/assets/images/` (e.g. `profile-placeholder.jpg`).
2. Update the import in `ProfileFrame.jsx` to point at your file.

That's the only place you need to change — every page that shows your photo pulls from this one component.

## Project preview images

Project cards use a generated abstract SVG graphic (`ProjectPreview` component) instead of stock photography, so there are no external images to source or license. Each project's `preview` field in `src/data/projects.js` selects which graphic variant to show. You can swap these for real screenshots later by replacing `ProjectPreview` with an `<img>` inside `ProjectCard.jsx` and `ProjectDetail.jsx`.

## Contact form

Contact inquiries are saved to the Firebase Realtime Database `contactInquiries` path.

1. Create a Firebase project and register a Web app in the Firebase console.
2. Create a Realtime Database for the project.
3. Copy `.env.example` to `.env` and fill in the Web app's Firebase configuration values, including the Realtime Database URL.
4. Publish the rules in `database.rules.json` in the Realtime Database Rules tab. The rules allow validated inquiry submissions only; reading, updating, and deleting inquiries from the client are denied.
5. Restart the development server after editing `.env`.

The Firebase web configuration is used by the browser and is not a server-side secret. Realtime Database rules must be published to the same project as the configuration for submissions to work.

## Admin panel

The admin panel is available at `/admin`; it contains a dashboard and a live contact-inquiries page at `/admin/inquiries`. Its demo login accepts `bhargav@gmail.com`, followed by the fixed code `1111`. This is only a client-side screen and is not authentication; anyone can bypass it.

The Realtime Database rules in `database.rules.json` allow public reads of all contact inquiries. Anyone who knows the database URL can retrieve submitters' names, email addresses, subjects, and messages, regardless of the admin screen. Publish these rules only if you explicitly want inquiry data to be public. Do not use this configuration for private contact data.

## Notes

- Respects `prefers-reduced-motion` — animations are minimized automatically for users who request it.
- The custom cursor and mouse-parallax effects are automatically disabled on touch devices.
- The dark glass/neon theme is the default; the header theme control also offers a saved light theme.
- Theme colors and typography are defined in `src/ui.css`; base design tokens live in `src/index.css`.
