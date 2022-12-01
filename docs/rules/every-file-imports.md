# every-file-imports

Ensure that files all import from a particular location.

## Rule Details

This rule allows you to set a particular library as a required import across various files. As such, it will warn whenever a file in the named area does not have either a `require` or an `import` of the specified path.

Examples of **incorrect** code for this rule with the configuration `{ '**/*.test.js': 'foo' }`:

```js
// src/path/to/file.test.js
import { foo } from 'anything';

// src/path/to/file.test.js
require('../foo');
```

Examples of **correct** code for this rule with the configuration `{ '**/*.test.js': 'foo' }`:

```js
// src/path/to/file.test.js
const fooLib = require('foo');

// src/path/to/file.test.js
import { bar, baz } from 'foo';

// src/path/to/file.js
require('anything at all');
```

## When Not To Use It

If you do not have a common import that is needed in all files.
