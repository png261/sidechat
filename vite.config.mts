import path from 'node:path'
import react from '@vitejs/plugin-react'
import type { UserConfigExport } from 'vite'
import dts from 'vite-plugin-dts'
import { configDefaults, defineConfig } from 'vitest/config'
import { name } from './package.json'
import tailwindcss from '@tailwindcss/vite'

const app = async (): Promise<UserConfigExport> => {
    const formattedName = name.match(/[^/]+$/)?.[0] ?? name

    return defineConfig({
        plugins: [
            react(),
            tailwindcss(),
            dts({
                insertTypesEntry: true,
            }),
        ],
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
            },
        },
        build: {
            lib: {
                entry: path.resolve(__dirname, 'src/index.ts'),
                name: formattedName,
                formats: ['es', 'umd'],
                fileName: format => `${formattedName}.${format}.js`,
            },
            rollupOptions: {
                external: ['react', 'react/jsx-runtime', 'react-dom'],
                output: {
                    globals: {
                        react: 'React',
                        'react/jsx-runtime': 'react/jsx-runtime',
                        'react-dom': 'ReactDOM',
                    },
                },
            },
        },
        test: {
            globals: true,
            environment: 'jsdom',
            coverage: {
                exclude: [
                    ...(configDefaults.coverage.exclude ?? []),
                    '**/*.config.js',
                ],
            },
        },
    })
}

export default app

