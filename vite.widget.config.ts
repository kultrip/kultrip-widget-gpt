import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/widget.tsx"),
      name: "KultripWidget",
      fileName: (format) => `kultrip-widget.${format}.js`,
      formats: ["umd"]
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {},
        exports: 'named',
        // Ensure CSS is included in the bundle
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'kultrip-widget.css';
          }
          return assetInfo.name || '';
        }
      }
    },
    cssCodeSplit: false,
    sourcemap: false,
    minify: false // Disable minify for debugging
  },
  define: {
    global: 'globalThis',
    'process.env': {},
    'process.env.NODE_ENV': '"production"'
  }
});