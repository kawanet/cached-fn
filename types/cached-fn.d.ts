/**
 * cachedFn - Lightweight, lazy, cached function that runs only once when needed
 */
export interface cachedFn {
    /**
     * `cachedFn()` generates a caching function with the same signature as the provided function.
     * - Stores and reuses results to speed up repeated calls with the same arguments.
     * - Especially beneficial for computationally expensive or resource-intensive functions.
     * - Uses lazy evaluation by computing results only upon invocation.
     */
    <T, U extends any[]>(fn: (...args: U) => T): ((...args: U) => T);

    /**
     * `cachedFn.flush()` clears all caches created by `cachedFn()`.
     * - Use this method to invalidate outdated results or free up memory.
     * - Once flushed, the next call to any cached function will recalculate its result.
     */
    flush(): void;
}

export const cachedFn: cachedFn;
