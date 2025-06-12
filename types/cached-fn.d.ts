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
     */
    <T, U extends any[]>(fn: (...args: U) => T): ((...args: U) => T);

    /**
     * `cachedFn.cycle(ms, fn)` returns a time-windowed cached version of `fn`.
     *
     * - `ms` defines the length of each cache window in milliseconds.
     * - Results are cached only within the current window slot.
     * - When a new window starts, the cache is invalidated automatically.
     */
    cycle<T, U extends any[]>(ms: number, fn: (...args: U) => T): ((...args: U) => T);


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

export const cachedFn: cachedFn;
