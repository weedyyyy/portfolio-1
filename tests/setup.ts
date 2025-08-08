import { vi } from "vitest";

// Provide dummy database URLs so Prisma client can instantiate without connecting
process.env.DATABASE_URL = process.env.DATABASE_URL ||
  "postgresql://user:pass@localhost:5432/testdb?schema=public";
process.env.DIRECT_URL = process.env.DIRECT_URL || process.env.DATABASE_URL;

// Stub console.error to reduce noise during tests
vi.spyOn(console, "error").mockImplementation(() => {});


