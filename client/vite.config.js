// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import NodePolyfills from "vite-plugin-node-polyfills";

// https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   build: {
//     outDir: "build",
//   },
// });

// export default defineConfig({
//   plugins: [
//     react(),
//     NodePolyfills({
//       // To polyfill `global`, `Buffer`, and other Node.js built-ins for the browser
//       protocolImports: true,
//     }),
//   ],
// });

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    global: {},
  },
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      "./runtimeConfig": "./runtimeConfig.browser",
    },
  },
});
