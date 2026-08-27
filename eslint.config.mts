import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
import eslintConfigPrettier from "eslint-config-prettier/flat";

export default defineConfig([
  js.configs.recommended,
  tseslint.configs.recommended,
  eslintConfigPrettier,
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      "prefer-arrow-callback": "error",
      "func-style": ["error", "expression"],
      eqeqeq: ["error", "always"],
      "require-await": "error",
      "no-promise-executor-return": "error",
      camelcase: ["error", { allow: ["^_"] }],
    },
  },
  {
    files: ["**/*.{ts,mts,cts}"],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      parser: tseslint.parser,
      parserOptions: {
        project: ["./tsconfig.json"],
      },
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/promise-function-async": "error",
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
