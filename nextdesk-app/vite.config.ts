import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    /**
     * Inlines all JS and CSS assets directly into index.html during build.
     * This produces a single self-contained HTML file suitable for
     * uploading as a Power Apps web resource.
     */
    viteSingleFile(),
  ],
  build: {
    /**
     * Disable CSS code-splitting so all styles are bundled into one chunk,
     * which the singlefile plugin then inlines into the HTML.
     */
    cssCodeSplit: false,
    /**
     * Ensure assets (like fonts referenced via CSS) are inlined as
     * data URIs rather than emitted as separate files.
     */
    assetsInlineLimit: 100000,
  },
})
