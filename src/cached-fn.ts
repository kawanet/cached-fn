/**
 * cachedFn - Lightweight, lazy, cached function that runs only once when needed
 */
import type * as declared from "../types/cached-fn.js";

type P = Record<string, [any]>
type Q = Record<number, P>
type R = Record<number, Q>
type S = Record<number, R>

// Storage
let S: S = {};

// Index counter
let Index = 0;

// Array.prototype.slice
const slice = [].slice;

const cycle: declared.cachedFn["cycle"] = (ms, fn) => {
    const idx = ++Index;
    const fnLen = fn.length;

    return function (this: any) {
        const slot = +ms && Math.floor(Date.now() / ms);

        let R = S[ms];
        let Q = R && R[slot];
        if (!Q) {
            R = S[ms] = {}
            Q = R[slot] = {}
        }
        const P = Q[idx] || (Q[idx] = {});

        const argLen = arguments.length;
        let key: string;
        if (!fnLen && !argLen) {
            key = "[]";
        } else {
            const args: any[] = slice.call(arguments);
            if (argLen < fnLen) args.length = fnLen;
            key = JSON.stringify(args);
        }

        const array = P[key] || (P[key] = [fn.apply(this, arguments)]);

        return array[0];
    };
}

// cachedFn(fn)
export const cachedFn = (fn => cycle(0, fn)) as declared.cachedFn;

// cachedFn.cycle(ms, fn)
cachedFn.cycle = cycle;

// cachedFn.flush()
cachedFn.flush = () => (S = {});
