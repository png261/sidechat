import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  splitting: false,
  // 👇 This is key
  preserveSymlinks: true,
  esbuildOptions(options) {
    options.banner = {
      js: '"use client";', // 👈 Ensures client directive is preserved
    }
  },
})

