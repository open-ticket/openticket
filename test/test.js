/* eslint-env mocha */
const assert = require("assert");
describe("Hello world", function () {
    let str = "Hello world!";
    it("should return hello world", function() {
        assert.equal(str, "Hello world!");
    });
});
