# Bhargav Labakamna — Portfolio

A premium, dark, animated developer portfolio built for a PHP / Laravel developer.
React + Vite, React Router, Framer Motion, Lucide icons.

## Getting started

```bash
npm install
npm run dev
```

Open the URL Netlify CLI prints (usually `http://localhost:8888`). Netlify Dev runs Vite and the project's serverless functions together.

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

## Updating the profile photo

Use **Admin → Profile update** (`/admin/profile`) to upload the photo. The browser sends it to a Netlify Function, which stores the image in the persistent Netlify Blobs store `admin-profile-images`. Firebase Realtime Database at `admin/1/image` stores only the generated filename. The portfolio reads that record and displays the image served by the function; new uploads therefore appear without a new site deploy. JPG, PNG, and WebP files up to 5 MB are accepted.

## Project preview images

Project cards use a generated abstract SVG graphic (`ProjectPreview` component) instead of stock photography, so there are no external images to source or license. Each project's `preview` field in `src/data/projects.js` selects which graphic variant to show. You can swap these for real screenshots later by replacing `ProjectPreview` with an `<img>` inside `ProjectCard.jsx` and `ProjectDetail.jsx`.

## Contact form

Contact inquiries are saved to the Firebase Realtime Database `contactInquiries` path.

1. Create a Firebase project and register a Web app in the Firebase console.
2. Create a Realtime Database for the project.
3. The Firebase Web app configuration is prefilled in `src/services/firebase.js`; `.env` values can override it for local or deployment-specific configuration.
4. Publish the rules in `database.rules.json` in the Realtime Database Rules tab. These demo rules grant public read and write access to the entire database.
5. Restart the development server after editing `.env`.

The Firebase web configuration is used by the browser and is not a server-side secret. Realtime Database rules must be published to the same project as the configuration for submissions to work. Netlify builds can use the prefilled config or set the corresponding `VITE_FIREBASE_*` variables in Site configuration → Environment variables and trigger a new deploy.

## Admin panel

The admin panel is available at `/admin`; it contains a dashboard, a live contact-inquiries page at `/admin/inquiries`, and a separate profile update page at `/admin/profile`. Its demo login accepts `bhargav@gmail.com`, followed by the fixed code `1111`. This is only a client-side screen and is not authentication; anyone can bypass it.

The Realtime Database rules in `database.rules.json` allow anyone on the internet to read, create, change, or delete all data in the Firebase database, regardless of the admin screen. This is suitable only for a disposable demo database and must not be used with real or private information.

The **Profile update** page saves the admin record with fixed ID `1` at `admin/1` in Realtime Database, using `id`, `first_name`, `last_name`, `email`, `mobile`, and `image` fields. The `image` value is only a filename; photo bytes are stored in Netlify Blobs, not Firebase Storage. Netlify Blobs is served by `netlify/functions/admin-profile-image.mjs`.

## Deploying to Netlify

Netlify builds with `npm run build`, publishes `dist`, and deploys functions from `netlify/functions`. Firebase's public web-app configuration is included in `src/services/firebase.js`, so no Firebase environment variables are required in Netlify. Deploy the updated app once to publish the profile-image function; subsequent image uploads are stored in Netlify Blobs and do not trigger a deploy. For local development, use `npm run dev` (`netlify dev`) so function requests are handled; Netlify CLI may ask you to log in or link the local project for Blobs access.

To enable the demo database access, copy the contents of `database.rules.json` into **Firebase Console → Realtime Database → Rules** and click **Publish**. Firebase rules are deployed separately from the website; changing this local file or deploying to Netlify does not publish the rules automatically.

## Notes

- Respects `prefers-reduced-motion` — animations are minimized automatically for users who request it.
- The custom cursor and mouse-parallax effects are automatically disabled on touch devices.
- The dark glass/neon theme is the default; the header theme control also offers a saved light theme.
- Theme colors and typography are defined in `src/ui.css`; base design tokens live in `src/index.css`.
