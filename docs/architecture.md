# WADV Architecture

## Core flow

`Input -> Ingest -> Memory -> Director Plan -> Scene Generation -> Review -> Edit -> Export`

WADV is intentionally scene-based. Projects contain episodes, episodes contain scenes, and scenes contain shots. Heavy AI and media jobs run only at the scene or shot layer so creators can selectively regenerate specific units rather than rerender entire episodes.

## Monorepo layout

- `apps/web`: Next.js App Router frontend and API handlers
- `apps/worker`: BullMQ worker entry point for async jobs
- `packages/ui`: cinematic shared UI components
- `packages/types`: shared domain contracts
- `packages/config`: app branding and shared navigation config
- `packages/lib`: Prisma access, provider adapters, validation, services, queues, storage, and auth helpers
- `prisma`: PostgreSQL schema and seed script

## Domain boundaries

Core domains implemented in the MVP:

- auth
- users
- billing
- projects
- episodes
- scenes
- shots
- characters
- character assets
- voices
- live-action assets
- art assets
- director reports
- generation jobs
- exports
- uploads
- timeline editor

## Provider architecture

All provider integrations are routed through interfaces in `packages/lib/src/providers/interfaces.ts`.

- `StoryProvider`
- `DirectorProvider`
- `ImageProvider`
- `VideoProvider`
- `VoiceProvider`
- `TranscriptionProvider`

The default registry uses mock providers so the entire experience is demoable without external keys.

## Storage and queue design

- Storage is abstracted by `StorageService` and currently uses local file writes.
- Queue dispatch goes through `enqueueJob` and falls back to mock queue responses when `REDIS_URL` is unavailable.
- The worker app is BullMQ-ready and updates Prisma records when jobs complete.

## Auth model

The MVP uses a dev-friendly signed cookie session with protected `/app` routes enforced by middleware. This is intentionally simple so teams can swap in NextAuth/Auth.js or a production identity provider later.
