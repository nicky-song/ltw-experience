import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import svgr from 'vite-plugin-svgr';

export default ({ mode }: any) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    plugins: [svgr(), react()],

    resolve: {
      alias: {
        '/src': path.resolve(process.cwd(), 'src'),
        './runtimeConfig': './runtimeConfig.browser',
        '@': path.resolve(__dirname, './src'),
        '@components': path.resolve(__dirname, './src/components'),
        '@features': path.resolve(__dirname, './src/features'),
        '@hooks': path.resolve(__dirname, './src/hooks'),
        '@pages': path.resolve(__dirname, './src/pages'),
        '@tests': path.resolve(__dirname, './src/tests'),
      },
    },
    root: process.env.VITE_IS_DOD === 'true' ? 'dod' : 'commercial',
    server: {
      port: 3000,
      open: './index.html',
    },
    build: {
      outDir: '../dist',
      rollupOptions: {
        input: {
          app:
            process.env.VITE_IS_DOD === 'true'
              ? './dod/index.html'
              : './commercial/index.html',
        },
      },
    },
  });
};
