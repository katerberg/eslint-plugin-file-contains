# eslint-plugin-file-contains

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]

ESLint rules for ensuring files have consistent usage of desired features. Allows you to enforce usage of imports across various file locations.

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm install eslint --save-dev
```

Next, install
`eslint-plugin-file-contains`:

```sh
npm install eslint-plugin-file-contains --save-dev
```

## Usage

Add `file-contains` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
  "plugins": ["check-file"]
}
```

Then configure the rules you want to use under the rules section.

```json
{
  "rules": {
    "file-contains/every-file-imports": [
      "error",
      {
        "**/*.test.{js,jsx,ts,tsx}": "jest-axe",
        "**/*.{jsx,tsx}": "react"
      }
    ]
  }
}
```

## Supported Rules

- [file-contains/every-file-imports](docs/rules/every-file-imports.md): Enforce that every file imports from an expected location for the specified file pattern

[npm-image]: https://img.shields.io/npm/v/eslint-plugin-file-contains.svg
[npm-url]: https://www.npmjs.com/package/eslint-plugin-file-contains
[downloads-image]: https://img.shields.io/npm/dm/eslint-plugin-file-contains.svg
[downloads-url]: https://www.npmjs.com/package/eslint-plugin-file-contains
