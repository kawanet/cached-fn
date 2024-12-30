/**
 * cachedFn - Lightweight, lazy, cached function that runs only once when needed
 */
import type * as declared from "../types/cached-fn.js";

// Storage
let S: Record<string, Record<string, [any]>> = {};

// Index counter
let Index = 0;

// Array.prototype.slice
const slice = [].slice;

// Cache function
export const cachedFn = (fn => {
    const idx = ++Index;
    const fnLen = fn.length;

    return function (this: any) {
        const cache = S[idx] || (S[idx] = {});
        const argLen = arguments.length;
        let key: string;
        if (!fnLen && !argLen) {
            key = "[]";
        } else {
            const args: any[] = slice.call(arguments);
            if (argLen < fnLen) args.length = fnLen;
            key = JSON.stringify(args);
        }
        const array = cache[key] || (cache[key] = [fn.apply(this, arguments)]);
        return array[0];
    };
}) as declared.cachedFn;

// Flush function
cachedFn.flush = () => (S = {});
