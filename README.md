# WADV

**Write it. Act it. Draw it. Voice it.**  
**Create anime your way.**

WADV is a production-minded creator-first anime studio SaaS MVP built as a full-stack monorepo. It lets creators combine story text, live-action acting, custom art, and voice performance into scene-based anime production workflows coordinated by the WADV Director.

## What is included

- Next.js App Router web application with premium dark cinematic UI
- Scene-based project hierarchy: Project -> Episode -> Scene -> Shot
- Mock-friendly auth, billing, storage, queue, and AI provider architecture
- Prisma schema targeting PostgreSQL
- BullMQ-ready worker app with a graceful mock fallback architecture
- Typed route handlers using Zod validation
- Seed script with a demo founder-ready project
- Documentation for architecture, APIs, and the WADV Director
- Vitest tests for core services and validation

## Quick start

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Copy environment variables:

   ```bash
   cp .env.example .env
   ```

3. Generate Prisma client and seed data:

   ```bash
   pnpm db:generate
   pnpm db:seed
   ```

4. Start the web app:

   ```bash
   pnpm --filter @wadv/web dev
   ```

5. Start the worker in another terminal:

   ```bash
   pnpm --filter @wadv/worker dev
   ```

## Environment variables

See `.env.example` for the complete list. The main variables are:

- `DATABASE_URL`: PostgreSQL connection string
- `REDIS_URL`: Redis/BullMQ connection
- `AUTH_SECRET`: cookie signing secret placeholder
- `STORAGE_DRIVER`: `local` by default for mock development
- `LOCAL_STORAGE_DIR`: where uploads are written in development
- `STRIPE_SECRET_KEY`: billing placeholder for future Stripe integration

## Mock architecture

WADV is immediately demoable without external AI provider keys.

- Story analysis returns believable scene/character extraction
- Director planning returns structured cinematic recommendations
- Image/video/voice/transcription providers emit realistic placeholder metadata
- Queue actions can be dispatched to a worker-ready adapter layer
- Storage uses a local file adapter in development but is abstracted for S3-compatible backends

## Swapping in real providers later

The system uses provider interfaces in `packages/lib/src/providers`. To add a real provider:

1. Implement the relevant interface.
2. Update the provider registry.
3. Keep service contracts unchanged.
4. Add secrets and provider-specific billing logic.

## Workspace layout

- `apps/web`: Next.js web experience and API routes
- `apps/worker`: BullMQ worker entrypoint
- `packages/ui`: shared premium UI primitives and cards
- `packages/types`: shared domain types and enums
- `packages/config`: shared config helpers
- `packages/lib`: services, schemas, provider interfaces, and data access helpers
- `prisma`: schema and seed script
- `docs`: architecture, API, and director docs

## Testing

```bash
pnpm test
```

## Notes

This MVP is optimized for founder demos, architecture clarity, and future provider integration rather than heavy media compute in local development.
