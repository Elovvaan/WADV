import { beforeEach, describe, expect, it, vi } from 'vitest';

const prismaMock = {
  project: { create: vi.fn() },
  scene: { deleteMany: vi.fn(), createMany: vi.fn() },
  episode: { create: vi.fn() },
  character: { upsert: vi.fn(), create: vi.fn() },
};

const providerRegistryMock = {
  story: { parse: vi.fn() },
};

vi.mock('../packages/lib/src/db', () => ({ prisma: prismaMock }));
vi.mock('../packages/lib/src/providers', () => ({ providerRegistry: providerRegistryMock }));

import { ProjectService } from '../packages/lib/src/services/project-service';

describe('ProjectService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates a project with a starter episode', async () => {
    prismaMock.project.create.mockResolvedValue({ id: 'project-1', episodes: [{ id: 'ep-1' }] });
    const service = new ProjectService();
    const result = await service.createProject({
      userId: 'user-1',
      title: 'New project',
      description: 'A long enough description for schema-level expectations.',
      formatType: 'EPISODE',
      genre: 'Drama',
      targetDuration: 120,
    });

    expect(prismaMock.project.create).toHaveBeenCalled();
    expect(result.id).toBe('project-1');
  });

  it('ingests a script into scenes and characters', async () => {
    providerRegistryMock.story.parse.mockResolvedValue({
      summary: 'parsed',
      scenes: [{ title: 'Opening Hook', scriptText: 'Scene text', emotionalBeat: 'Wonder', durationTargetSeconds: 25 }],
      characters: [{ name: 'Ren', role: 'Lead', stylePreset: 'Noir protagonist' }],
    });

    prismaMock.project.create.mockReset();
    (prismaMock as any).project.findUniqueOrThrow = vi.fn().mockResolvedValue({ id: 'project-1', episodes: [{ id: 'ep-1' }] });
    (prismaMock as any).project.update = vi.fn().mockResolvedValue({});
    prismaMock.character.upsert.mockResolvedValue({ id: 'char-1' });

    const service = new ProjectService();
    const result = await service.ingestScript('project-1', 'This is a sufficiently long anime story input that can be parsed into scenes and characters.');

    expect(providerRegistryMock.story.parse).toHaveBeenCalled();
    expect(prismaMock.scene.createMany).toHaveBeenCalled();
    expect(result.characters[0]?.name).toBe('Ren');
  });
});
