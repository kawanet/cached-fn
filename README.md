# cached-fn

[![Node.js CI](https://github.com/kawanet/cached-fn/actions/workflows/nodejs.yml/badge.svg?branch=main)](https://github.com/kawanet/cached-fn/actions/)
[![npm version](https://img.shields.io/npm/v/cached-fn)](https://www.npmjs.com/package/cached-fn)
[![gzip size](https://img.badgesize.io/https://cdn.jsdelivr.net/npm/cached-fn/dist/cached-fn.min.js?compression=gzip)](https://cdn.jsdelivr.net/npm/cached-fn/dist/cached-fn.min.js)

Lightweight and lazy cached function with TTL, negative TTL, and item limit controls.

## SYNOPSIS

```javascript
/**
 * Simple cache system for fetching text (cache never expires)
 */
const fetchText = cachedFn(async (url) => {
    const res = await fetch(url)
    return res.text()
})

/**
 * Singleton pattern (cache never expires)
 */
const getInstance = cachedFn(() => new MyClass())

/**
 * Cached fetch for JSON with options:
 * - cycle: results are scoped to 5-minute windows
 * - cache is automatically invalidated every 5 minutes
 */
const fetchJson = cachedFn({cycle: 5 * 60 * 1000}, async (url) => {
    const res = await fetch(url)
    return res.json()
})

/**
 * Cached fetch for ArrayBuffer with options:
 * - maxItems: up to 100 cache entries
 * - cache: cache expires after 60 seconds
 * - negativeCache: failed results cached for 1 second
 */
const fetchBuffer = cachedFn({maxItems: 100, cache: 60 * 1000, negativeCache: 1000}, async (url) => {
    const res = await fetch(url)
    return res.arrayBuffer()
})
```

### Function Usage

```javascript
const text = await fetchText(url)

const instance = getInstance()

const json = await fetchJson(url)

const buffer = await fetchBuffer(url)
```

### Flushing All Cache

```javascript
process.on("SIGHUP", () => cachedFn.flush())
```

## SEE ALSO

- https://www.npmjs.com/package/cached-fn
- https://github.com/kawanet/cached-fn

## MIT LICENSE

Copyright (c) 2024-2025 Yusuke Kawasaki

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
