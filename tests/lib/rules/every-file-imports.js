'use strict';

const rule = require('../../../lib/rules/every-file-imports');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester();

const testWithDefaults = (test) => {
  return Object.assign(
    {
      parserOptions: Object.assign(
        {
          sourceType: 'module',
          ecmaVersion: 9,
        },
        test.parserOptions
      ),
    },
    test
  );
};

ruleTester.run('every-file-imports', rule, {
  valid: [
    testWithDefaults({
      code: "import blah from 'foo'; var foo = 1; expect(foo).toEqual(0); expect(1).toBe(1);",
      filename: 'src/components/DisplayLabel/__tests__/displayLabel.test.js',
      options: [{ '**/*.test.js': 'foo' }],
    }),
    testWithDefaults({
      code: "var blah = require('foo')",
      filename: 'src/components/DisplayLabel/__tests__/displayLabel.test.js',
      options: [{ '**/*.test.js': 'foo' }],
    }),
    testWithDefaults({
      code: "import blah from 'foo'; var foo = 1; expect(foo).toEqual(0); expect(1).toBe(1);",
      filename: 'src/components/DisplayLabel/__tests__/displayLabel.js',
      options: [{ '**/*.test.js': 'foo' }],
    }),
  ],

  invalid: [
    testWithDefaults({
      code: "import blah from 'foo'; var foo = 1; expect(foo).toEqual(0); expect(1).toBe(1);",
      filename: 'src/components/DisplayLabel/__tests__/displayLabel.test.js',
      options: [],
      errors: [
        {
          message: 'No rules provided.',
        },
      ],
    }),
    testWithDefaults({
      code: "import blah from 'foo'; var foo = 1; expect(foo).toEqual(0); expect(1).toBe(1);",
      filename: 'src/components/DisplayLabel/__tests__/displayLabel.test.js',
      options: [{ '**/*.test.js': 'food' }],
      errors: [
        {
          message:
            'src/components/DisplayLabel/__tests__/displayLabel.test.js is missing import from "food".',
        },
      ],
    }),
    testWithDefaults({
      code: "import blah from 'somewhere'; var foo = 1; expect(foo).toEqual(0); expect(1).toBe(1);",
      filename: 'src/components/DisplayLabel/__tests__/displayLabel.js',
      options: [{ '**/DisplayLabel/**/*': 'foo' }],
      errors: [
        {
          message:
            'src/components/DisplayLabel/__tests__/displayLabel.js is missing import from "foo".',
        },
      ],
    }),
  ],
});
