import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig(({ mode }) => {
  const isProd = mode === "production"

  return {
    resolve: {
      tsconfigPaths: true,
    },

    plugins: [
      react(),
    ],

    optimizeDeps: {
      include: [ "react", "react-dom", "mobx", "inversify" ],
    },

    build: {
      target: "es2020",
      sourcemap: isProd ? "hidden" : false,
      minify: isProd ? "oxc" : false,
      cssCodeSplit: true,
      rolldownOptions: {

        output: {
          codeSplitting: {
            minSize: 10_000,
            groups: [
              {
                name: "vendor-react",
                test: /node_modules[\\/]react/,
                priority: 3,
              },
              {
                name: "vendor-mobx",
                test: /node_modules[\\/]mobx/,
                priority: 2,
              },
              {
                name: "vendor-inversify",
                test: /node_modules[\\/]inversify/,
                priority: 1,
              },
              {
                name: "vendor-main",
                test: /node_modules/,
                priority: 0,
              },
            ],
          },
        },
        
        treeshake: {
          moduleSideEffects: [
            { test: /\.css$/, sideEffects: true },
            { test: /reflect-metadata/, sideEffects: true },
            { external: true, sideEffects: false },
          ],
          unknownGlobalSideEffects: false,
          propertyReadSideEffects: false,
        }
      },
    },
    server: {
      port: 3000,
      hmr: true,
      open: false,
      proxy: {
        "/sessions": "http://localhost:8000",
        "/session": "http://localhost:8000",
        "/user": "http://localhost:8000",
        "/cards": "http://localhost:8000",
      },
    },
    preview: {
      port: 1337,
    }
  }
})
