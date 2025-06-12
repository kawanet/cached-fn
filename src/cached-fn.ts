/**
 * cachedFn - Lightweight, lazy, cached function that runs only once when needed
 */
import type * as declared from "../types/cached-fn.js";

type O = [unknown]
type P = Record<string, O>
type Q = Record<number, P>
type R = Record<number, Q>
type S = Record<number, R>

// Storage
let S: S = {};

// Index counter
let Index = 0;

// Array.prototype.slice
const slice = [].slice;

const cycle = ((ms, fn) => {
    const idx = ++Index;
    const fnLen = fn.length;

    return function (this: unknown) {
        // eslint-disable-next-line prefer-rest-params
        const args = arguments as ArrayLike<unknown> as Parameters<typeof fn>;
        const slot = +ms && Math.floor(Date.now() / ms);

        let R = S[ms];
        let Q = R && R[slot];
        if (!Q) {
            R = S[ms] = {}
            Q = R[slot] = {}
        }
        const P = Q[idx] || (Q[idx] = {});

        const argLen = args.length
        let key: string;
        if (!fnLen && !argLen) {
            key = "[]";
        } else {
            const array: unknown[] = slice.call(args)
            if (argLen < fnLen) array.length = fnLen
            key = JSON.stringify(array)
        }

        const O = P[key] || (P[key] = [fn.apply(this, args)] as O);

        return O[0];
    };
}) as declared.cachedFn["cycle"]

// cachedFn(fn)
export const cachedFn = (fn => cycle(0, fn)) as declared.cachedFn;

// cachedFn.cycle(ms, fn)
cachedFn.cycle = cycle;

// cachedFn.flush()
cachedFn.flush = () => (S = {});
