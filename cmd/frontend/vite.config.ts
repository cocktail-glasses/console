/// <reference types="vitest" />
import { optimizeLodashImports } from '@optimize-lodash/rollup-plugin';
import dynamicImportVars from '@rollup/plugin-dynamic-import-vars';
import react from '@vitejs/plugin-react';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';
import { compression } from 'vite-plugin-compression2';
import vitePluginImp from 'vite-plugin-imp';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

const backendUrl = 'http://127.0.0.1:8099';

export default defineConfig({
  define: {
    global: 'globalThis',
  },
  envPrefix: 'REACT_APP_',
  base: process.env.PUBLIC_URL,
  server: {
    port: 3003,
    cors: true,
    open: true,
    proxy: {
      '/k8s': {
        target: backendUrl,
        changeOrigin: true,
        ws: true,
      },
      '/api': {
        target: backendUrl,
        changeOrigin: true,
      },
      '/select': {
        target: backendUrl,
        changeOrigin: true,
      },
      '/auth': {
        target: backendUrl,
        changeOrigin: true,
      },
    },
  },
  plugins: [
    svgr({
      svgrOptions: {
        prettier: false,
        svgo: false,
        svgoConfig: {
          plugins: [{ removeViewBox: false }],
        },
        titleProp: true,
        ref: true,
      },
    }),
    react(),
    nodePolyfills({
      include: ['process', 'buffer', 'stream'],
    }),
    tsconfigPaths(),
    visualizer(),
    // Plugin imp
    vitePluginImp({
      libList: [
        {
          libName: '@mui/material',
          libDirectory: '',
          camel2DashComponentName: false,
        },
        {
          libName: '@mui/icons-material',
          libDirectory: 'esm',
          camel2DashComponentName: false,
        },
        {
          libName: 'lodash',
          libDirectory: '',
          camel2DashComponentName: false,
        },
        // @mui/x-date-pickers is not default export.
        // {
        //   libName: '@mui/x-date-pickers',
        //   libDirectory: '',
        //   camel2DashComponentName: false,
        // },
      ],
    }),
    compression({
      algorithm: 'gzip',
    }),
    // dynamicImportVars({
    //   // options
    //   exclude: ['index.html']
    // }),
    optimizeLodashImports(),
  ],
  resolve: {
    alias: {
      '@resources': path.resolve(__dirname, 'src/resources'),
    },
  },
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
  },
  // test: {
  //   globals: true,
  //   environment: 'jsdom',
  //   env: {
  //     UNDER_TEST: 'true',
  //   },
  //   alias: [
  //     {
  //       find: /^monaco-editor$/,
  //       replacement: __dirname + '/node_modules/monaco-editor/esm/vs/editor/editor.api',
  //     },
  //   ],
  //   coverage: {
  //     reporter: ['text'],
  //   },
  //   restoreMocks: false,
  //   setupFiles: ['./src/setupTests.ts'],
  // },
  build: {
    outDir: process.env.OUT_DIR,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    modulePreload: false,
    rollupOptions: {
      // Exclude @axe-core from production bundle
      external: ['@axe-core/react'],
      output: {
        compact: true,
        manualChunks: {
          // 'mui-base': ['@mui/base'],
          mui: ['@mui/material'],
          // 'mui-datepicker': ['@mui/x-date-pickers'],
          // 'mui-x-tree-view': ['@mui/x-tree-view'],
          // 'mui-icon': ['@mui/icons-material'],
          'mui-vendor': ['@mui/x-date-pickers', '@mui/x-tree-view', '@mui/icons-material'],
          // 'material-react-table': ['material-reactvi-table'],
          'monaco-editor': ['monaco-editor', '@monaco-editor/react'],
          apidevtools: ['@apidevtools/json-schema-ref-parser', '@apidevtools/swagger-parser'],
          xterm: ['@xterm/xterm', '@xterm/addon-fit', '@xterm/addon-search'],
          recharts: ['recharts'],
          vendor: [
            'lodash',
            'notistack',
            'js-base64',
            'js-yaml',
            'humanize-duration',
            'jotai',
            '@tanstack/react-query',
            'material-react-table',
            'spacetime',
            'dayjs',
            'class-transformer',
            'class-validator',
            'yaml',
          ],
        },
      },
    },
  },
});
