/**
 * @file The filename should follow the filename naming convention
 * @author Mark Katerberg
 */

const micromatch = require('micromatch');
const path = require('path');
const isGlob = require('is-glob');

/**
 * @returns {string} path from repository root
 * @param {string} fullPath filename with full path
 * @param {string} repositoryRoot path of repository root
 */
const getPathFromRepositoryRoot = (fullPath, repositoryRoot) =>
  fullPath.replace(path.join(repositoryRoot, path.sep), '');

/**
 * Callback for file path
 *
 * @callback callback
 * @param {string} p file path
 */
/**
 * @returns {callback} piped function
 * @param {callback[]} fns callback functions
 */
const pipe =
  (...fns) =>
  (x) =>
    fns.reduce((v, f) => f(v), x);

/**
 * @returns {string} file path in posix style
 * @param {string} p file path based on the operating system
 */
const toPosixPath = (p) => p.split(path.sep).join(path.posix.sep);

/**
 * @returns {string} file path without drive letter on windows
 * @param {string} p file path on windows
 */
const removeDriveLetter = (p) => p.replace(/^[A-Za-z]:\\/, '');

/** @typedef {module:eslint} ESLint */
/**
 * @returns {string} file path in posix style
 * @param {ESLint.Rule.RuleContext} context rule eslint context
 */
const getFilePath = (context) => {
  const pathFromRoot = getPathFromRepositoryRoot(
    context.getPhysicalFilename(),
    context.getCwd()
  );

  return pipe(removeDriveLetter, toPosixPath)(pathFromRoot);
};

/** @typedef {module:eslint} ESLint */
/**
 * @type {ESLint.Rule.RuleModule}
 */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'The file should include a specified import',
      recommended: false,
    },
    fixable: null,
    schema: [
      {
        additionalProperties: {
          type: 'string',
        },
      },
      {
        type: 'object',
        properties: {
          ignoreMiddleExtensions: { type: 'boolean' },
        },
      },
    ],
  },

  create(context) {
    return {
      Program: (n) => {
        const body = n.body;
        if (!body) {
          return;
        }

        if (
          !context ||
          !context.options ||
          !context.options[0] ||
          !(context.options[0] instanceof Object) ||
          Object.keys(context.options[0]).length === 0
        ) {
          context.report({
            node: n,
            message: 'No rules provided.',
          });
          return;
        }

        const rules = context.options[0];

        Object.keys(rules).forEach((rule) => {
          if (!isGlob(rule)) {
            context.report({
              node: n,
              message:
                'There is an invalid pattern in "{{rule}}", please correct it.',
              data: {
                rule,
              },
            });
            return;
          }
        });

        Object.keys(rules).forEach((rule) => {
          const filePath = getFilePath(context);
          if (micromatch.isMatch(filePath, rule)) {
            let containsMatch = false;
            body.every((node) => {
              if (
                node.type === 'VariableDeclaration' &&
                node.declarations &&
                node.declarations.length === 1 &&
                node.declarations[0].init &&
                node.declarations[0].init.arguments
              ) {
                const args = node.declarations[0].init.arguments;
                if (args.length === 1 && args[0].value === rules[rule]) {
                  containsMatch = true;
                  return false;
                }
              }
              if (node.type === 'ImportDeclaration' && node.source) {
                if (node.source.value === rules[rule]) {
                  containsMatch = true;
                  return false;
                }
              }
              return true;
            });
            if (!containsMatch) {
              context.report({
                node: n,
                message: `${filePath} is missing import from "${rules[rule]}".`,
              });
            }
          }
        });
      },
    };
  },
};
