module.exports = {
  extends: ["prettier"],
  plugins: ["prettier"],
  rules: {
    "prettier/prettier": ["error"],
  },
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  //   extends: [
  //     "prettier",
  //     "eslint:recommended",
  //     "plugin:react/recommended",
  //     "plugin:@typescript-eslint/recommended",
  //   ],
  //   overrides: [],
  //   parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  //   plugins: ["react", "@typescript-eslint", "prettier"],
  settings: {
    react: {
      version: "detect",
    },
  },
  //   rules: {
  //     "prettier/prettier": "error",
  //     // "react/react-in-jsx-scope": "off",
  //     // indent: ["error", 4],
  //     // "linebreak-style": ["error", "unix"],
  //     // quotes: ["error", "double"],
  //     // semi: ["error", "always"],
  //   },
};
