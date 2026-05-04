import js from "@eslint/js"
import globals from "globals"
import eslintReact from "eslint-plugin-react"
import reactHooks from "eslint-plugin-react-hooks"
import reactRefresh from "eslint-plugin-react-refresh"
import eslintTypeScript from "typescript-eslint"
import tseslint from "typescript-eslint"
import { defineConfig, globalIgnores } from "eslint/config"

export default defineConfig([
  globalIgnores([ "node_modules", "dist", "eslint.config.js", "public" ]),
  // JavaScript, TypeScript
  js.configs.recommended,
  ...tseslint.configs.recommended,

  // ReactHooks, ReactRefresh
  reactHooks.configs.flat.recommended,
  reactRefresh.configs.vite,
  {
    plugins: {
      "react": eslintReact,
      "@typescript-eslint": eslintTypeScript.plugin,
    },
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    settings: {
      react: {
        version: "detect",
      },
    },
    languageOptions: {
      ecmaVersion: "latest",
      parserOptions: {
        project: [ "tsconfig.json", "tsconfig.app.json", "tsconfig.node.json" ],
      },
      globals: {
        ...globals.node,
        ...globals.browser,
        ...globals.es2026,
      },
    },
    files: [ "**/*.{ts,tsx,js,jsx}" ],
    rules: {
      // React
      "react/jsx-key": "error",
      "react/no-deprecated": "warn",
      "react/no-unstable-nested-components": [ "error", { allowAsProps: true } ],
      "react-hooks/exhaustive-deps": "warn",
      "react-hooks/rules-of-hooks": "error",

      // TypeScript
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-empty-interface": "warn",
      "@typescript-eslint/explicit-module-boundary-types": "error",
      "@typescript-eslint/no-unused-vars": [ "warn", { argsIgnorePattern: "^_" } ],

      // Other
      "semi": [ "error", "never" ],
      "quotes": [ "error", "double" ],
      "eol-last": [ "error", "always" ],
      "object-curly-spacing": [ "error", "always" ],
      "array-bracket-spacing": [ "error", "always" ],
    }
  },
])
