var tape = require("tape"),
    processBrowser = require("..");


global.process = processBrowser;


tape("process.hrtime(previousTimestamp: Array)", function(assert) {
    processBrowser.hrtime();
    assert.end();
});

tape("process.uptime()", function(assert) {
    processBrowser.uptime();
    assert.end();
});

tape("process.nextTick(fn: Function)", function(assert) {
    var snyc = false;
    processBrowser.nextTick(function onNextTick() {
        assert.equal(snyc, true);
        assert.end();
    });
    snyc = true;
});

tape("process.memoryUsage()", function(assert) {
    var memory = processBrowser.memoryUsage();
    assert.equal(memory.rss >= 0, true);
    assert.equal(memory.heapTotal >= 0, true);
    assert.equal(memory.heapUsed >= 0, true);
    assert.end();
});
