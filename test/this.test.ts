import {strict as assert} from "node:assert"
import {test} from "node:test"
import {ondemand} from "../src/ondemand.js"

test("this", async () => {
    class MyClass {
        a = 0
        b = 0;
        inc = ondemand(function (this: MyClass, key: string): number {
            assert.ok(this instanceof MyClass)
            return ++(this[key.toLowerCase() as keyof MyClass] as number);
        })
    }

    const obj = new MyClass()

    assert.equal(obj.inc("a"), 1)
    assert.equal(obj.inc("a"), 1)
    assert.equal(obj.inc("A"), 2)
    assert.equal(obj.inc("A"), 2)

    assert.equal(obj.inc("b"), 1)
    assert.equal(obj.inc("b"), 1)
    assert.equal(obj.inc("B"), 2)
    assert.equal(obj.inc("B"), 2)
})
