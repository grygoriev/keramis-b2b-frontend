import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

// https://vite.dev/config/
export default defineConfig({
	root: '.',
	plugins: [react(), svgr()],
	build: {
		outDir: 'build',
		emptyOutDir: true,
	},
	server: {
		proxy: {
			'/api': {
				// target: 'http://localhost:8000',
				// target: 'http://localhost:3001',
				target: 'https://159.69.148.221',
				changeOrigin: true,
				secure: false,
			},
		},
	},
});
