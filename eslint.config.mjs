import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Apply Next.js configs
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  
  // Global ignores
  {
    ignores: [
      "src/generated/**",
      "node_modules/**",
      ".next/**",
      "**/*.js",
      "build/**",
      "dist/**",
      ".vercel/**"
    ]
  },
  
  // Rules configuration
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off", 
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/no-this-alias": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "react/no-unescaped-entities": "off",
      "react-hooks/exhaustive-deps": "warn",
      "@next/next/no-img-element": "warn"
    }
  }
];

export default eslintConfig;
