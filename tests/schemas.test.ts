import { describe, expect, it } from 'vitest';
import { ingestScriptSchema, projectSchema } from '../packages/lib/src/schemas';

describe('schema validation', () => {
  it('accepts a valid project payload', () => {
    const result = projectSchema.parse({
      title: 'Neon Memory Cathedral',
      description: 'A rich cyber-fantasy pilot for scene-based anime production.',
      formatType: 'EPISODE',
      genre: 'Cyber-fantasy',
      targetDuration: 420,
    });

    expect(result.title).toBe('Neon Memory Cathedral');
  });

  it('rejects a short ingest script payload', () => {
    expect(() => ingestScriptSchema.parse({ input: 'too short', inputType: 'idea' })).toThrow();
  });
});
