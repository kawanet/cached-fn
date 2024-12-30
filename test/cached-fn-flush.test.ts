import {strict as assert} from "node:assert"
import {test} from "node:test"
import {cachedFn} from "../src/cached-fn.js"

test("cachedFn.flush()", async () => {
    let count = 0
    const counter = cachedFn((_: string) => ++count)

    assert.equal(counter("a"), 1)
    assert.equal(counter("a"), 1)
    assert.equal(counter("b"), 2)
    assert.equal(counter("b"), 2)

    cachedFn.flush();

    assert.equal(counter("b"), 3)
    assert.equal(counter("b"), 3)
    assert.equal(counter("a"), 4)
    assert.equal(counter("a"), 4)
})
