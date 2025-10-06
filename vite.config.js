import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import svgr from  '@svgr/rollup';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.jsx'],
            refresh: true,
        }),
        react(),
        svgr(),
    ],
    server: {
        hmr: {
            host: 'medicosolomed.com',
            protocol: 'ws',
            clientPort: 5173
        },
        cors: true,
        port: 5173,
        host:'0.0.0.0'
    },
});
