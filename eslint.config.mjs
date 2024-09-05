import globals from "globals";
import js from "@eslint/js";

import stylisticJs from "@stylistic/eslint-plugin-js";
export default [
  js.configs.recommended,

  { ignores: ["dist/**"] },
  {
    plugins: {
      "@stylistic/js": stylisticJs,
    },
    rules: {
      "@stylistic/js/indent": ["error", 2],
      // "@stylistic/js/linebreak-style": ["error", "windows"],
      // "@stylistic/js/quotes": ["error", "single"],
      // "@stylistic/js/semi": ["error", "never"],
      eqeqeq: "error",
      "@stylistic/js/no-trailing-spaces": "error",
      "@stylistic/js/object-curly-spacing": ["error", "always"],
      "@stylistic/js/arrow-spacing": ["error", { before: true, after: true }],
      "no-console": "off",
    },
  },

  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      globals: {
        ...globals.node,
      },
      ecmaVersion: "latest",
    },
  },
];
