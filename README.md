# Portfolio

A server-rendered portfolio built with React Router 8, Vite+, Tailwind CSS, and Cloudflare Workers.

## Requirements

- Node.js 24 or newer
- Vite+ (`vp`)
- A Cloudflare account for deployment

## Local development

Install dependencies and start the React Router development server:

```bash
vp install
vp run dev
```

The app is available at `http://localhost:5173`. The Cloudflare Vite plugin runs server code in the Workers runtime during development.

## Motion Studio

Studio runs with the Vite development server. Press Alt+T (Option+T on macOS)
to open the timeline, preview an animation edit, and press Apply to save it to source.
React Router renders its own HTML, so `app/root.tsx` includes the plugin's client
script only in development. Production builds omit that script and instrumentation.

Set `MTL_AGENT_PROVIDER=codex` in the ignored `.env.local`. The installed Codex SDK
reuses your existing sign-in.

For private package installs, export `MOTION_TOKEN` in your shell. pnpm 12 does
not expand credentials from the project's `.npmrc`, so pass its scoped auth
setting through the environment:

```bash
env "pnpm_config_//api.motion.dev/npm/:_authToken=$MOTION_TOKEN" vp install
```

Keep the token out of source control. The `.npmrc` contains only its environment
reference, and package managers do not automatically load `.env` files.

## Type generation and checks

Generate React Router route types and Cloudflare runtime/binding types:

```bash
vp run cf-typegen
```

Run the repository checks and TypeScript project build:

```bash
vp check
vp run typecheck
```

`worker-configuration.d.ts` is generated from `wrangler.jsonc` and should be regenerated whenever bindings or compatibility settings change.

## Build and preview

Create a production build:

```bash
vp run build
```

Preview a fresh production build in the local Workers runtime:

```bash
vp run preview
```

Validate the Worker bundle without deploying it:

```bash
vp run cf:dry-run
```

## Tests

The repository does not contain automated test files yet. `vp test` therefore reports "No test files found" and exits with status 1; the production build, Wrangler dry run, and local Worker preview are the current runtime checks.

## Deploy to Cloudflare Workers

Authenticate Wrangler once on your machine:

```bash
vp exec wrangler login
```

Then build and deploy the Worker:

```bash
vp run deploy
```

The initial deployment uses the `portfolio` Worker name and a `workers.dev` URL. Custom domains can be attached later in the Cloudflare dashboard or Wrangler configuration.

## Cloudflare bindings

This project starts without KV, D1, R2, or other runtime bindings. When a binding is needed:

1. Add it to `wrangler.jsonc`.
2. Run `vp run cf-typegen`.
3. Import `cloudflareContext` from `app/context.ts` and access the generated binding in a route loader or action with `context.get(cloudflareContext).env`.

Future MDX content can be compiled into React modules at build time and bundled with the Worker without adding a content database.
