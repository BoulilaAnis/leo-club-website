# Leo Club Klibia

A full-featured club management platform for Leo Club Klibia built with Next.js and Payload CMS. Manages two clubs — Alpha (-18) and Omega (18+) — with member accounts, events, score tracking, and public-facing pages.

## Features

- **Dual club system** — Independent Alpha (under 18) and Omega (18+) clubs with separate members, events, and history
- **Member authentication** — Token-based login with 30-day sessions, httpOnly cookies, self-service profiles
- **Score tracking** — Adjustments with reasons, auto-calculated scores per member
- **Events management** — Admin-created events with dates, descriptions, and types
- **Club history** — Timeline of club milestones and achievements
- **Member directory** — Searchable member list with avatars and positions
- **Responsive design** — Mobile-first with animated navbar, hamburger menu
- **Dark mode** — System-default theme with animated toggle (View Transitions API)
- **Admin panel** — Payload CMS admin for full CRUD operations

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js](https://nextjs.org/) 16 |
| CMS | [Payload](https://payloadcms.com/) 3.85 |
| Database | MongoDB via `@payloadcms/db-mongodb` |
| Editor | Lexical rich text (`@payloadcms/richtext-lexical`) |
| Styling | Tailwind CSS v4 + `class-variance-authority` |
| Animations | `motion/react` |
| Icons | `lucide-react` |
| Storage | Vercel Blob Storage (`@payloadcms/storage-vercel-blob`) |
| UI Components | ReUI, MagicUI |
| Analysis | Vercel Analytics + Speed Insights |

## Getting Started

### Prerequisites

- Node.js 20+
- MongoDB instance (local or Atlas)
- pnpm (recommended) or npm

### Installation

```bash
git clone <repo-url> leo-club
cd leo-club
pnpm install
```

### Environment Variables

Copy `.env.example` to `.env` and fill in the values:

```env
DATABASE_URL=mongodb://127.0.0.1/leo-club
PAYLOAD_SECRET=your-random-secret-here
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...
BLOB_STORE_ID=store_...
```

### Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). The Payload admin panel is at `/admin`.

### Generate Types

After schema changes:

```bash
pnpm generate:types
pnpm generate:importmap
```

## Collections

| Collection | Slug | Purpose |
|------------|------|---------|
| Users | `users` | Admin accounts (club admins + super admins) |
| Members | `members` | Club member accounts with auth, position, score |
| Events | `events` | Club events with dates and descriptions |
| Event Types | `event-types` | Categorization for events |
| Club History | `club-history` | Timeline entries for club milestones |
| Score Adjustments | `score-adjustments` | Individual score changes with reasons |
| Positions | `positions` | Member roles (President, Secretary, etc.) |
| Media | `media` | Uploaded images and files (Vercel Blob) |

## Project Structure

```
src/
├── app/
│   ├── (frontend)/        # Public-facing pages
│   │   ├── club/[slug]/   # Club pages (alpha, omega)
│   │   │   ├── members/   # Member area (auth required)
│   │   │   ├── events/    # Events pages
│   │   │   └── about/     # Club info + history
│   │   └── layout.tsx     # Root layout with nav
│   ├── (payload)/         # Payload admin
│   └── api/               # Custom API routes
│       ├── member-login/  # Member JWT login
│       └── member-logout/ # Clear session
├── collections/           # Payload collection configs
├── components/
│   └── ui/                # UI components (shadcn-style)
├── lib/
│   ├── access.ts          # Access control helpers
│   ├── auth.ts            # Server-side auth (getMemberUser)
│   ├── client-auth.ts     # Client-side authedFetch
│   ├── club.ts            # Club data
│   ├── fields.ts          # Reusable field definitions
│   ├── hooks.ts           # Collection hooks
│   └── utils.ts           # cn() utility
└── payload.config.ts      # Payload configuration
```

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm generate:types` | Regenerate Payload TypeScript types |
| `pnpm generate:importmap` | Regenerate Payload import map |
| `pnpm test` | Run integration + E2E tests |

## Deployment

Designed for [Vercel](https://vercel.com). The production build outputs a standalone Next.js app:

```bash
pnpm build
pnpm start
```

Requires a MongoDB connection and Vercel Blob Storage credentials in production environment variables.
