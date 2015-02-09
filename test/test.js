var assert = require("assert"),
    process = require("../src/index");


describe("process", function() {
    describe("#nextTick(callback)", function() {
        it("should call function on next loop", function() {
            var value = false;
            process.nextTick(function() {
                assert.equal(value, true);
            });
            value = true;
        });
    });
});
