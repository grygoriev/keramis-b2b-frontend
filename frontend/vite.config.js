import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

// https://vite.dev/config/
export default defineConfig(({ mode }) =>{
	const env = loadEnv(mode, process.cwd(), '');

	const isDev = mode === 'development';

	return {
		root: '.',
		plugins: [react(), svgr()],
		build: {
			outDir: 'build',
			emptyOutDir: true,
		},
		server: isDev
			? {
				proxy: {
					'/api': {
						// target: 'http://localhost:8000',
						// target: 'http://localhost:3001',
						// target: 'https://159.69.148.221',
						target: env.VITE_API_BASE || 'http://localhost:8000',
						changeOrigin: true,
						secure: false,
						},
					},
				}
			: undefined,
	};
});
