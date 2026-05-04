// Browser-side shim for `node:test`. Aliased into the test bundle by
// the rollup test config so the test sources can import the same
// names (`describe`, `it`, `before`, `after`) under both Node (real
// node:test) and the browser (this file).
//
// Test results are rendered into `<ul id="results">` on the host
// page (the element is created on demand if absent).
//
// Tests run sequentially through a single Promise chain. cached-fn's
// TTL tests rely on real timers and would race if run in parallel,
// so sync tests are also queued — registration order = run order.

const stack: string[] = [];

const root = (): HTMLElement => {
    let el = document.getElementById("results");
    if (!el) {
        el = document.createElement("ul");
        el.id = "results";
        document.body.appendChild(el);
    }
    return el;
};

const append = (text: string, color: string, suffix?: string): void => {
    const li = document.createElement("li");
    li.textContent = text;
    li.style.color = color;
    if (suffix) {
        const span = document.createElement("span");
        span.textContent = " " + suffix;
        span.style.color = "gray";
        li.appendChild(span);
    }
    root().appendChild(li);
};

// Sequential test queue. it() / before() / after() bodies append
// onto this chain so that tests, both sync and async, run one after
// another. Each queued body has its own try/catch so a failure does
// not break the chain — `queue` itself stays fulfilled forever.
let queue: Promise<unknown> = Promise.resolve();

type Body = () => unknown;
type Options = Record<string, unknown>;

export const describe = (name: string, fn: () => void): void => {
    stack.push(name);
    try {
        fn();
    } finally {
        stack.pop();
    }
};

// Accepts both `it(name, fn)` and `it(name, options, fn)`. The
// optional second argument (e.g. `{timeout: 1000}`) is currently
// ignored — per-test timeout is not honored by this shim.
export const it = (name: string, ...rest: [Body] | [Options, Body]): void => {
    const fn = rest[rest.length - 1] as Body;
    const label = [...stack, name].join(" › ");
    queue = queue.then(async () => {
        const start = performance.now();
        try {
            await fn();
            append("✔ " + label, "green", `(${Math.round(performance.now() - start)}ms)`);
        } catch (e) {
            const msg = e instanceof Error ? e.message : String(e);
            append("✘ " + label + ": " + msg, "red", `(${Math.round(performance.now() - start)}ms)`);
        }
        // append("⚠ " + label + ": " + reason, "darkorange"); // verdict 不明時の表示形 (skip / todo / timeout など将来の再利用候補)
    });
};

export const before = (fn: Body): void => {
    queue = queue.then(async () => {
        try {
            await fn();
        } catch (e) {
            const msg = e instanceof Error ? e.message : String(e);
            append("✘ before(): " + msg, "red");
        }
    });
};

export const after = (fn: Body): void => {
    queue = queue.then(async () => {
        try {
            await fn();
        } catch (e) {
            const msg = e instanceof Error ? e.message : String(e);
            append("✘ after(): " + msg, "red");
        }
    });
};
