# React Course — Example Code Workspace (Next.js)

Same idea as the Vite version: one npm-workspaces monorepo, one small
Next.js project per session. Single `npm install` for everything; each
session still runs and builds independently.

## Structure

```
course/
  package.json              root workspace config
  scripts/new-session.mjs   scaffolds a new session
  modules/
    m01-fundamentals/
      s01-jsx/               a real, standalone Next.js project (App Router, src/)
      s02-components/
    m02-hooks/
      s01-use-state/
```

Each `modules/<module>/<session>` is a normal Next.js app scaffolded with
`create-next-app`, App Router, and a `src/` directory — `src/app/layout.tsx`
+ `src/app/page.tsx`, same as any Next.js project. Naming convention: `m01`,
`m02`, ... for modules, `s01`, `s02`, ... for sessions, matching your Marp
slide numbering.

## First-time setup

```
nvm use   # or: fnm use
npm install
```

The repo pins its Node version in `.nvmrc` (currently 22.16.0). Run
`nvm use` (or `fnm use`) from the repo root first so you're on the right
Node version, then `npm install` once — it installs and hoists
dependencies for every session under `modules/`, so you don't get a
separate `node_modules` per folder.

## Making it your own GitHub repo

The class repo is private, so your clone still points at it as `origin`.
Before you start committing your own work, point it at a new, empty repo
of your own instead:

1. On GitHub, create a new **empty** repository (no README, `.gitignore`,
   or license — you already have those from the clone).
2. Repoint your local clone at it:

   ```
   git remote remove origin
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git push -u origin main
   ```

3. From now on, `git push` / `git pull` go to your own repo, not the
   class one.

## Adding a new session

```
npm run new-session -- m01-fundamentals s02-components
```

Runs `create-next-app` under the hood with non-interactive defaults:
TypeScript, App Router, `src/` directory, ESLint, no Tailwind, npm, and
`--skip-install` (so it doesn't create its own nested `node_modules` —
the root `npm install` handles that).

You can override any default by repeating the flag, e.g. to add Tailwind
to one specific session:

```
npm run new-session -- m01-fundamentals s02-components --tailwind
```

## Running a session during a lecture

```
npm run dev -w modules/m01-fundamentals/s01-jsx
```

The `-w` flag targets that one workspace only. Same pattern for build/lint:

```
npm run build -w modules/m01-fundamentals/s01-jsx
npm run lint  -w modules/m01-fundamentals/s01-jsx
```

## Notes

- Sessions are intentionally independent — no shared code between them.
  If a session needs different tooling entirely (e.g. a Vite session
  mixed into the same course), give it its own project outside this
  workspace rather than forcing it in.
- `next/font/google` requires network access to fetch fonts at build/dev
  time — if you're on a restricted network, either use a local font or
  swap to `next/font/local`.
- `.gitignore` already excludes `node_modules`, `.next`, and `dist` at
  every level.
