export const SceneStatus = {
  DRAFT: 'DRAFT',
  PLANNED: 'PLANNED',
  GENERATING: 'GENERATING',
  REVIEWING: 'REVIEWING',
  NEEDS_FIX: 'NEEDS_FIX',
  READY: 'READY',
  APPROVED: 'APPROVED',
} as const;

const delegateHandler: ProxyHandler<Record<string, unknown>> = {
  get(_target, prop) {
    if (prop === '$transaction') {
      return async <T>(callback: (client: PrismaClient) => Promise<T>) => callback(new PrismaClient());
    }
    if (prop === '$disconnect') {
      return async () => undefined;
    }
    if (prop === '$connect') {
      return async () => undefined;
    }
    return new Proxy({}, {
      get(_delegateTarget, method) {
        if (method === 'then') {
          return undefined;
        }
        return async () => {
          throw new Error(`Prisma client stub cannot execute ${String(prop)}.${String(method)} without a generated runtime.`);
        };
      },
    });
  },
};

export class PrismaClient {
  constructor(_options?: unknown) {
    return new Proxy(this, delegateHandler);
  }
}

export type Prisma = Record<string, unknown>;
