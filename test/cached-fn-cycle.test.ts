import {strict as assert} from "node:assert"
import {test} from "node:test"
import {cachedFn} from "../src/cached-fn.js"

test("cachedFn.cycle()", async () => {
    let count = 0

    const counter = cachedFn.cycle(20, (_: string) => ++count)

    assert.equal(counter("a"), 1)
    assert.equal(counter("a"), 1)
    assert.equal(counter("b"), 2)
    assert.equal(counter("b"), 2)

    await new Promise(resolve => setTimeout(resolve, 30))

    assert.equal(counter("b"), 3)
    assert.equal(counter("b"), 3)
    assert.equal(counter("a"), 4)
    assert.equal(counter("a"), 4)
})
