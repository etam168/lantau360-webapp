module.exports = {
  root: true,
  env: {
    node: true,
    es2021: true
  },
  extends: [
    "./eslint.js.config.js",
    "eslint:recommended",
    "plugin:vue/vue3-essential",
    "prettier",
    "@vue/typescript/recommended",
    "@vue/eslint-config-prettier",
    "plugin:prettier/recommended"
  ],
  plugins: ["prettier"],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module"
  },
  rules: {
    "prettier/prettier": "error",
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "vue/multi-word-component-names": [
      "error",
      {
        ignores: ["Home", "About", "Login", "Index"]
      }
    ],
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-var-requires": "off",
    "@typescript-eslint/no-useless-constructor": "error",
    "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }]
  }
};
