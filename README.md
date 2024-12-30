# cached-fn

[![Node.js CI](https://github.com/kawanet/cached-fn/workflows/Node.js%20CI/badge.svg?branch=main)](https://github.com/kawanet/cached-fn/actions/)
[![npm version](https://badge.fury.io/js/cached-fn.svg)](https://badge.fury.io/js/cached-fn)

Lightweight, lazy, cached function that runs only once when needed

## SYNOPSIS

```javascript
import {cachedFn} from "cached-fn";

/**
 * Simple cache system for fetching text
 */
const fetchText = cachedFn(async (url) => {
  const res = await fetch(url);
  return res.text();
});

/**
 * Singleton pattern
 */
const getInstance = cachedFn(() => new MyClass());
```

### Function Usage

```javascript
const text = await fetchText(url);

const instance = getInstance();
```

### Flushing All Cache

```javascript
process.on("SIGHUP", () => cachedFn.flush());
```

## SEE ALSO

- https://www.npmjs.com/package/cached-fn
- https://github.com/kawanet/cached-fn

## MIT LICENSE

Copyright (c) 2024 Yusuke Kawasaki

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
