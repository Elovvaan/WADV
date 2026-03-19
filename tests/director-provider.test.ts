import { describe, expect, it } from 'vitest';
import { providerRegistry } from '../packages/lib/src/providers';

describe('mock director provider', () => {
  it('returns a structured director plan', async () => {
    const plan = await providerRegistry.director.createPlan({
      title: 'Test project',
      description: 'Project description',
      genre: 'Drama',
      scenes: [{ title: 'Scene 1', scriptText: 'Scene text', orderIndex: 1 }],
      characters: [{ name: 'Ren', role: 'Lead' }],
    });

    expect(plan.scenePlans.length).toBeGreaterThan(0);
    expect(plan.nextBestActions.length).toBeGreaterThan(0);
  });
});
