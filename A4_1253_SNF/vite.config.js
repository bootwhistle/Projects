import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  // ── Vitest configuration ─────────────────────────────────────────────────
  // This block is only used when running `npm test` or `vitest`.
  // It does not affect the normal `npm run dev` build.
  test: {
    // Use jsdom to simulate a browser environment (DOM, window, document, etc.)
    environment: 'jsdom',

    // Make test globals (describe, it, expect, vi, beforeEach, etc.)
    // available without importing them in every test file.
    globals: true,

    // Run this file before each test suite to configure jest-dom matchers
    // like toBeInTheDocument(), toHaveValue(), etc.
    setupFiles: './src/setupTests.js',

    // Skip processing CSS files in tests — CSS modules return {}
    // which is fine because we test behavior, not styling.
    css: false,
  },
});
