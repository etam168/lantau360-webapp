module.exports = {
  root: true,
  env: {
    node: true,
    es2021: true
  },
  extends: [
    "eslint:recommended",
    "plugin:vue/vue3-essential",
    "prettier",
    "@vue/typescript/recommended",
    "@vue/eslint-config-prettier",
    "plugin:prettier/recommended"
  ],
  plugins: ["prettier"],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    "prettier/prettier": "error",
    "typescript/no-var-requires": "off",

    "no-useless-constructor": "off",
    "no-empty-function": "off",
    "no-unused-vars": "off",
    "vue/no-unused-vars": "off",
    "vue/no-setup-props-destructure": "off",
    "vue/multi-word-component-names": [
      "error",
      {
        ignores: ["Home", "About", "Login", "Index"]
      }
    ],
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any": 0,
    "@typescript-eslint/no-var-requires": 0,
    "@typescript-eslint/no-unused-vars": ["error"],
    "@typescript-eslint/no-useless-constructor": "error",
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off"
  }
};
