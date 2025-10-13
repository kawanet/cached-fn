/**
 * cachedFn - Lightweight, lazy, cached function that runs only once when needed
 */
export interface cachedFn {
    /**
     * `cachedFn(fn)` returns a memoized version of `fn` with unlimited cache duration.
     *
     * - Caches and reuses results for identical arguments to avoid repeated computation.
     * - Ideal for expensive or resource-intensive synchronous functions.
     * - Lazy: computes and caches the result on the first invocation.
     * - To invalidate all stored results, call `cachedFn.flush()`.
     */<T, U extends unknown[]>(fn: (...args: U) => T, options?: CachedFnOptions): ((...args: U) => T);

    /**
     * @deprecated
     */
    cycle<T, U extends unknown[]>(ms: number, fn: (...args: U) => T): ((...args: U) => T);

    /**
     * `cachedFn.flush()` clears all caches created by both `cachedFn()` and `cachedFn.cycle()`.
     *
     * - Instantly invalidates every stored result, freeing associated memory.
     * - After clearing, the next call to any cached function will recompute and repopulate its cache.
     *
     * @example
     * process.on("SIGHUP", () => cachedFn.flush());
     */
    flush(): void;
}

interface CachedFnOptions {
    /**
     * Cache duration in milliseconds when resolved.
     * -1: no expiration. 0: do not cache.
     */
    cache?: number

    /**
     * Cache duration in milliseconds when rejected.
     * -1: no expiration. 0: do not cache.
     */
    negativeCache?: number

    /**
     * Time-window size in milliseconds for cache grouping.
     * All caches in the same window are cleared together at window end.
     * This is a fixed time slot, not a duration from completion.
     */
    cycle?: number
}

export const cachedFn: cachedFn;
