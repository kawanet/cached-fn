/**
 * cachedFn - Lightweight, lazy, cached function that runs only once when needed
 */
import type * as declared from "../types/cached-fn.js";

type O = [unknown, number?] // result and expiration
type P = Record<string, O>  // arguments key
type Q = Record<number, P>  // counter
type R = Record<number, Q>  // cycle start msec
type S = Record<number, R>  // cycle size msec

const isPromise = <T>(value: any): value is Promise<T> => (value && "function" === typeof value.then)

// Storage
let S: S = {};

// Index counter
let Index = 0;

// Array.prototype.slice
const slice = [].slice;

const factory = ((fn, options) => {
    const idx = ++Index;
    const fnLen = fn.length;

    /**
     * Time-window size in milliseconds for cache grouping.
     * All caches in the same window are cleared together at window end.
     * This is a fixed time slot, not a duration from completion.
     */
    const cycle = +options.cycle || 0

    /**
     * Cache duration in milliseconds when resolved.
     * -1: no expiration. 0: do not cache.
     * @default -1
     */
    let positiveCache = options.cache
    if (positiveCache !== 0) positiveCache = +positiveCache || -1

    /**
     * Cache duration in milliseconds when rejected.
     * -1: no expiration. 0: do not cache.
     * @default 0
     */
    let negativeCache = options.negativeCache
    if (negativeCache !== 0) negativeCache = +negativeCache || 0

    return function <T>(this: unknown): T {
        // eslint-disable-next-line prefer-rest-params
        const args = arguments as ArrayLike<unknown> as Parameters<typeof fn>;
        const slot = +cycle && Math.floor(Date.now() / cycle);

        let R = S[cycle];
        let Q = R && R[slot];
        if (!Q) {
            R = S[cycle] = {}
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

        const cached = P[key] as [T, number]
        if (cached) {
            const expires = cached[1]
            if (expires < 0 || Date.now() < expires) {
                return cached[0]
            }
        }

        const packed = P[key] = [fn.apply(this, args) as T, -1]
        const result = packed[0]

        if (isPromise(result)) {
            return result.then((resolved) => {
                updateExpiry(positiveCache)
                return resolved
            }, (rejected) => {
                updateExpiry(negativeCache)
                return Promise.reject(rejected) // pass through
            }) as T
        } else {
            updateExpiry(positiveCache)
            return result
        }

        function updateExpiry(duration: number) {
            // update expiration date
            const expiry = packed[1] = (duration > 0 ? (Date.now() + duration) : duration)

            // remove from cache when cache disabled
            if (!expiry) {
                delete P[key]
            }
        }
    };
}) as declared.cachedFn

// cachedFn(fn)
export const cachedFn = ((fn, options) => factory(fn, options || {})) as declared.cachedFn;

// cachedFn.cycle(ms, fn)
cachedFn.cycle = (ms, fn) => factory(fn, {cycle: ms})

// cachedFn.flush()
cachedFn.flush = () => (S = {});
