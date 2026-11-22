import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

const root = import.meta.dirname;

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(root, 'src'),
      '@components': resolve(root, 'src/components'),
      '@layouts': resolve(root, 'src/layouts'),
      '@scripts': resolve(root, 'src/scripts'),
      '@styles': resolve(root, 'src/styles'),
      '@content': resolve(root, 'src/content'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['tests/unit/**/*.test.ts'],
  },
});
