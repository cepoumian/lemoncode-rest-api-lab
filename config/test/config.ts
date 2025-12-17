import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    restoreMocks: true,
    setupFiles: ['./config/test/env.setup.ts', './config/test/db.setup.ts'],
  },
});
