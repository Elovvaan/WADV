import { beforeEach, describe, expect, it, vi } from 'vitest';
import { demoDirectorPlan } from '../packages/lib/src/mock-data';

const prismaMock = {
  project: {
    findUniqueOrThrow: vi.fn(),
    update: vi.fn(),
  },
  directorReport: {
    upsert: vi.fn(),
  },
};

const providerRegistryMock = {
  director: { createPlan: vi.fn() },
};

vi.mock('../packages/lib/src/db', () => ({ prisma: prismaMock }));
vi.mock('../packages/lib/src/providers', () => ({ providerRegistry: providerRegistryMock }));

import { WadvDirectorService } from '../packages/lib/src/services/wadv-director-service';

describe('WadvDirectorService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('builds and persists a director plan', async () => {
    prismaMock.project.findUniqueOrThrow.mockResolvedValue({
      id: 'project-1',
      title: 'Project',
      description: 'Description',
      genre: 'Drama',
      episodes: [{ scenes: [{ title: 'Scene 1', scriptText: 'Text', orderIndex: 1 }] }],
      characters: [{ name: 'Ren', role: 'Lead' }],
    });
    providerRegistryMock.director.createPlan.mockResolvedValue(demoDirectorPlan);
    prismaMock.directorReport.upsert.mockResolvedValue({ id: 'report-1', reportJson: demoDirectorPlan });
    prismaMock.project.update.mockResolvedValue({});

    const service = new WadvDirectorService();
    const result = await service.buildProjectPlan('project-1');

    expect(providerRegistryMock.director.createPlan).toHaveBeenCalled();
    expect(prismaMock.directorReport.upsert).toHaveBeenCalled();
    expect(result.id).toBe('report-1');
  });
});
