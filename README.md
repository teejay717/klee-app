# Klee

Klee is a platform for roommates and households that manages chores, splits expenses, and keeps everyone on the same page.

## Features

- **Chores** — assign and track household chores
- **Shared expenses** — record expenses and split them among roommates
- **Dashboard** — see a summary of household activity at a glance
- **Apartments / households** — create and switch between household orgs
- **Email notifications** — transactional emails via Resend
- **Cron jobs** — scheduled background tasks (e.g. daily cleanup)

## Tech Stack

- [Next.js 16](https://nextjs.org/) (App Router, TypeScript)
- [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- [Clerk](https://clerk.com/) — authentication and organization management
- [Drizzle ORM](https://orm.drizzle.team/) + [Neon](https://neon.tech/) (Postgres)
- [Upstash Redis](https://upstash.com/) — rate limiting and caching
- [Resend](https://resend.com/) — email
- [Google Generative AI](https://ai.google.dev/) — AI-powered summaries

## Getting Started

### Prerequisites

- Node.js 20 or later
- `npm`

### Local Development

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env.local` file with the environment variables used by the app (Clerk keys, Resend, AI, etc.). Copy the values from your Vercel project environment or a teammate. The server-side variables (`DATABASE_URL`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`) live in a separate `.env` file.

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000).

### Useful Commands

| Command                | Description                          |
| ---------------------- | ------------------------------------ |
| `npm run dev`          | Start the development server         |
| `npm run build`        | Create a production build            |
| `npm run start`        | Serve the production build           |
| `npm run lint`         | Run ESLint                           |
| `npm run typecheck`    | Run the TypeScript type checker      |
| `npm run format`       | Format code with Prettier            |

## CI/CD

This project uses **GitHub Actions** for continuous integration and **Vercel** for continuous deployment.

### Continuous Integration

The [CI workflow](.github/workflows/ci.yml) runs on every push and pull request to the `master` branch:

1. **Checkout** — `actions/checkout@v4` pulls the repository onto the runner
2. **Set up Node.js** — `actions/setup-node@v4` installs Node 20 and caches npm dependencies
3. **Install dependencies** — `npm ci` performs a clean, lockfile-exact install
4. **Lint** — `npm run lint` runs ESLint
5. **Typecheck** — `npm run typecheck` runs `tsc --noEmit`
6. **Build** — `npm run build` produces a production build, confirming the app compiles

Secrets needed at build time (e.g. `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `DATABASE_URL`) are stored as GitHub Actions secrets and injected through the workflow's `env` block.

### Continuous Deployment

Deployment is handled by **Vercel's GitHub integration**. Every successful push to the `master` branch triggers a production build on Vercel, which automatically updates the live site:

**Live site:** https://klee-app-rust.vercel.app

Because Vercel manages its own build and environment variables, the GitHub Actions pipeline is intentionally CI-only — it validates the code, and Vercel ships it.
