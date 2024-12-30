import {strict as assert} from "node:assert"
import {test} from "node:test"
import {ondemand, ondemandFlush} from "../src/ondemand.js"

test("ondemand-flush", async () => {
    let count = 0
    const counter = ondemand((_: string) => ++count)

    assert.equal(counter("a"), 1)
    assert.equal(counter("a"), 1)
    assert.equal(counter("b"), 2)
    assert.equal(counter("b"), 2)

    ondemandFlush();

    assert.equal(counter("b"), 3)
    assert.equal(counter("b"), 3)
    assert.equal(counter("a"), 4)
    assert.equal(counter("a"), 4)
})
