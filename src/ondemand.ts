/**
 * ondemand - Lightweight, lazy, and simple cache built on demand
 */
import * as declared from "../types/ondemand.js";

// Storage
let S: Record<string, Record<string, [any]>> = {};

// Index counter
let Index = 0;

// Array.prototype.slice
const slice = [].slice;

/**
 * `ondemand()` generates a caching function that mirrors the signature of the provided function.
 * - Stores and reuses results to accelerate repeated calls with identical arguments.
 * - Ideal for optimizing computationally expensive or resource-intensive functions.
 * - Implements lazy evaluation by computing results only when invoked.
 */
export const ondemand: typeof declared.ondemand = fn => {
    const idx = ++Index;
    const length = fn.length;

    return function (this: any) {
        const cache = S[idx] || (S[idx] = {});
        const args: any[] = slice.call(arguments);
        if (args.length < length) args.length = length;
        const key = JSON.stringify(args);
        const array = cache[key] || (cache[key] = [fn.apply(this, arguments)]);
        return array[0];
    };
};

/**
 * `ondemandFlush()` clears all caches created by `ondemand()`.
 * - Use this method to invalidate cached results that are outdated or to reclaim memory.
 * - After clearing, cached functions will recompute their results upon the next invocation.
 */
export const ondemandFlush: typeof declared.ondemandFlush = () => (S = {});
