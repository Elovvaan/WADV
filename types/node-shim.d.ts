declare namespace NodeJS {
  interface ProcessEnv {
    [key: string]: string | undefined;
  }
}

declare const process: {
  env: NodeJS.ProcessEnv;
  cwd(): string;
  exit(code?: number): never;
};

declare const Buffer: {
  from(input: string, encoding?: string): { toString(encoding?: string): string };
};

declare module 'node:crypto' {
  export function createHmac(algorithm: string, secret: string): {
    update(value: string): { digest(encoding: string): string };
  };
}

declare module 'node:fs/promises' {
  export function mkdir(path: string, options?: { recursive?: boolean }): Promise<void>;
  export function writeFile(path: string, data: unknown): Promise<void>;
}

declare module 'node:path' {
  export function join(...parts: string[]): string;
}
