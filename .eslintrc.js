module.exports = {
  "root": true,
  "env": {
    "browser": true,
    "node": true,
    "es6": true,
    // "jquery": true
    "jest": true,
    // 能够在jsx中使用if，需要配合另外的babel插件使用
    "jsx-control-statements/jsx-control-statements": true
  },
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 6,
    "sourceType": 'module',
    "ecmaFeatures": {
      "jsx": true,
      "experimentalObjectRestSpread": true,
    }
  },
  "globals": {
    // "wx": "readonly",
  },
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:jsx-control-statements/recommended", // 需要另外配合babel插件使用
  ],
  "settings": {
    "react": {
      "version": "detect" // 自动读取已安装的react版本
    }
  },
  "plugins": [
    "@typescript-eslint",
    "react",
    "jsx-control-statements"
  ],
  "rules": {
    // "jsx-control-statements/jsx-choose-not-empty": 1,
    // "jsx-control-statements/jsx-for-require-each": 1,
    // "jsx-control-statements/jsx-for-require-of": 1,
    // "jsx-control-statements/jsx-if-require-condition": 1,
    // "jsx-control-statements/jsx-otherwise-once-last": 1,
    "jsx-control-statements/jsx-use-if-tag": 0,
    // "jsx-control-statements/jsx-when-require-condition": 1,
    // "jsx-control-statements/jsx-jcs-no-undef": 1,
    "react/prop-types": "off",
    "react/no-string-refs":"off",
    "no-extra-semi": 0, // 禁止不必要的分号
    
    "quotes": ['error', 'single'], // 强制使用单引号
    "no-unused-vars": 0, // 不允许未定义的变量
    "require-atomic-updates":"off",
    "no-undef": "off",
    "no-def": "off",
    "indent": 0,
    "linebreak-style": 0,
    "quotes": 0,
    "no-extra-semi": 0,
    "no-unused-expressions": 0,
    "no-unused-vars": 0,
    "no-console": 0,
    "no-mixed-spaces-and-tabs": 0,
    "no-cond-assign": 0,
    "no-useless-escape":0
  }
};