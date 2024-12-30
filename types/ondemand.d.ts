/**
 * ondemand - Lightweight, lazy, and simple cache built on demand
 */
export const ondemand: <T, U extends any[]>(fn: (...args: U) => T) => ((...args: U) => T);

export const ondemandFlush: () => void;
