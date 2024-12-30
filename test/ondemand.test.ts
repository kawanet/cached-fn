import {strict as assert} from "node:assert"
import {test} from "node:test"
import {ondemand} from "../src/ondemand.js"

test("ondemand", async () => {
    let count = 0
    const counter = ondemand(() => ++count)
    assert.equal(counter(), 1)
    assert.equal(counter(), 1)
    assert.equal(counter(), 1)

    const number = ondemand((v: number) => +v)
    assert.equal(number(1), 1)
    assert.equal(number(1), 1)
    assert.equal(number(2), 2)
    assert.equal(typeof number(2), "number")

    const string = ondemand((v: string) => String(v))
    assert.equal(string("a"), "a")
    assert.equal(string("a"), "a")
    assert.equal(string("b"), "b")
    assert.equal(typeof string("b"), "string")

    const object = ondemand(() => [] as any[])
    assert.equal(object(), object())
})
