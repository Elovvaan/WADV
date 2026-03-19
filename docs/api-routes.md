# WADV API routes

## Projects

- `GET /api/projects`
- `POST /api/projects`
- `GET /api/projects/:id`
- `POST /api/projects/:id/ingest-script`
- `POST /api/projects/:id/director/plan`
- `POST /api/projects/:id/generate-scenes`
- `POST /api/projects/:id/export`

## Scenes and shots

- `GET /api/scenes/:id`
- `PATCH /api/scenes/:id`
- `POST /api/scenes/:id/generate`
- `POST /api/shots/:id/regenerate`

## Characters

- `GET /api/characters`
- `POST /api/characters`
- `GET /api/characters/:id`
- `POST /api/characters/:id/upload-art`
- `POST /api/characters/:id/assign-voice`

## Voices

- `GET /api/voices`
- `POST /api/voices`
- `POST /api/voices/record`
- `POST /api/voices/upload`
- `POST /api/voices/clone`

## Live action and exports

- `POST /api/live-action/upload`
- `POST /api/live-action/:id/process`
- `GET /api/exports/:id`

## Validation

All JSON payloads are validated using Zod schemas defined in `packages/lib/src/schemas.ts`.
