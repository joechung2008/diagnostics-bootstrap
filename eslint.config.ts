import prettierConfig from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";
import reactDomPlugin from "eslint-plugin-react-dom";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import reactPlugin from "eslint-plugin-react-x";
import { globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default [
  globalIgnores(["coverage", "dist"]),
  ...tseslint.configs.recommended,
  reactPlugin.configs.recommended,
  reactDomPlugin.configs.recommended,
  reactHooks.configs["recommended-latest"],
  reactRefresh.configs.vite,
  prettierConfig,
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      "prettier/prettier": "error",
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
];
