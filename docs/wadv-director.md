# WADV Director

## Purpose

The WADV Director is a cinematic AI planning layer designed to feel like a transparent production assistant rather than a one-click black box.

## Current responsibilities

- story analysis orchestration
- scene recommendations
- continuity suggestions
- visual style planning
- camera language planning
- performance and voice suggestions
- next-best action recommendations

## Output contract

The Director writes structured JSON with these keys:

- `projectSummary`
- `scenePlans[]`
- `continuityWarnings[]`
- `characterRecommendations[]`
- `voiceSuggestions[]`
- `visualStylePlan`
- `cameraStylePlan`
- `nextBestActions[]`

## Service entry point

`packages/lib/src/services/wadv-director-service.ts`

This service loads project context from Prisma, invokes the configured Director provider, and persists the resulting report to `DirectorReport`.

## Mock behavior

The mock Director returns cinematic recommendations focused on continuity, creator-owned assets, and scene-specific shot suggestions so the UI feels immediately useful in demos.
