import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
import eslintConfigPrettier from "eslint-config-prettier/flat";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
  },
  tseslint.configs.recommended,
  eslintConfigPrettier,
  {
    rules: {
      "@typescript-eslint/no-implicit-any": "error",
      "prefer-arrow-callback": "error",
      "func-style": ["error", "expression"],
      "@typescript-eslint/no-unused-vars": "error",
      eqeqeq: ["error", "always"],
      "require-await": "error",
      "no-promise-executor-return": "error",
      "@typescript-eslint/promise-function-async": "error",
      camelcase: ["error", { allow: ["^_"] }],
      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: "typeLike",
          format: ["PascalCase"],
        },
      ],
    },
  },
]);