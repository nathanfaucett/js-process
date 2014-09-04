module.exports = typeof(process) !== "undefined" ? process : (function() {
    var EventEmitter = require("event_emitter");


    function Process() {

        EventEmitter.call(this);

        this.pid = 0;
        this.title = "browser";
        this.env = {};
        this.argv = [];
        this.version = "1.0.0";
        this.versions = {};
        this.config = {};
        this.execPath = ".";
        this.execArgv = [];
        this.arch = ((/\b(?:AMD|IA|Win|WOW|x86_|x)[32|64]+\b/i.exec(navigator.userAgent) || "")[0] || "unknown").replace(/86_/i, "").toLowerCase();
        this.platform = (navigator.platform.split(/[ \s]+/)[0]).toLowerCase() || "unknown";
        this.maxTickDepth = 1000;
        this._cwd = location.pathname;
    }
    EventEmitter.extend(Process);

    Object.defineProperty(Process.prototype, "browser", {
        get: function() {
            return true;
        }
    });

    Process.prototype.memoryUsage = (function() {
        var performance = window.performance || {},
            memory = {
                rss: 0,
                heapTotal: 0,
                heapUsed: 0
            };

        performance.memory || (performance.memory = {});

        return function memoryUsage() {
            memory.rss = performance.memory.jsHeapSizeLimit || 0;
            memory.heapTotal = performance.memory.totalJSHeapSize || 0;
            memory.heapUsed = performance.memory.usedJSHeapSize || 0;

            return memory;
        };
    }());

    Process.prototype.nextTick = (function() {
        var canSetImmediate = !!window.setImmediate,
            canPost = window.postMessage && window.addEventListener;

        if (canSetImmediate) {
            return function(fn) {
                return window.setImmediate(fn)
            };
        }

        if (canPost) {
            var queue = [];

            window.addEventListener("message", function(e) {
                var source = e.source;

                if ((source === window || source === null) && e.data === "process-tick") {
                    e.stopPropagation();

                    if (queue.length > 0) queue.shift()();
                }
            }, true);

            return function nextTick(fn) {
                queue.push(fn);
                window.postMessage("process-tick", "*");
            };
        }

        return function nextTick(fn) {
            window.setTimeout(fn, 0);
        };
    }());

    Process.prototype.cwd = function() {
        return this._cwd;
    };

    Process.prototype.chdir = function(dir) {
        var cwd = location.pathname,
            length = cwd.length,
            newDir = dir.length >= length ? dir : dir.substring(0, cwd.length) + "/";

        if (cwd.indexOf(newDir) === 0) {
            this._cwd = dir;
        } else {
            throw new Error("process.chdir can't change to directory " + dir);
        }
    };

    Process.prototype.hrtime = (function() {
        var performance = window.performance || {},
            start;

        Date.now || (Date.now = function now() {
            return (new Date()).getTime();
        });
        start = Date.now();

        performance.now || (performance.now =
            performance.mozNow ||
            performance.msNow ||
            performance.oNow ||
            performance.webkitNow ||
            function now() {
                return Date.now() - start;
            }
        );

        function performanceNow() {
            return start + performance.now();
        }

        return function hrtime(previousTimestamp) {
            var clocktime = performanceNow() * 1e-3,
                seconds = Math.floor(clocktime),
                nanoseconds = (clocktime % 1) * 1e9;

            if (previousTimestamp) {
                seconds -= previousTimestamp[0];
                nanoseconds -= previousTimestamp[1];

                if (nanoseconds < 0) {
                    seconds--;
                    nanoseconds += 1e9;
                }
            }

            return [seconds, nanoseconds]
        }
    }());

    Process.prototype.uptime = (function() {
        var start = Date.now();

        return function uptime() {
            return ((Date.now() - start) * 1e-3) | 0;
        }
    }());

    Process.prototype.abort = function() {
        throw new Error("process.abort is not supported");
    };

    Process.prototype.binding = function(name) {
        throw new Error("process.binding is not supported");
    };

    Process.prototype.umask = function(mask) {
        throw new Error("process.umask is not supported");
    };

    Process.prototype.kill = function(id, signal) {
        throw new Error("process.kill is not supported");
    };

    Process.prototype.initgroups = function(user, extra_group) {
        throw new Error("process.initgroups is not supported");
    };

    Process.prototype.setgroups = function(groups) {
        throw new Error("process.setgroups is not supported");
    };

    Process.prototype.getgroups = function() {
        throw new Error("process.getgroups is not supported");
    };

    Process.prototype.getuid = function() {
        throw new Error("process.getuid is not supported");
    };

    Process.prototype.setgid = function() {
        throw new Error("process.setgid is not supported");
    };

    Process.prototype.getgid = function() {
        throw new Error("process.getgid is not supported");
    };

    Process.prototype.exit = function() {
        throw new Error("process.exit is not supported");
    };

    Process.prototype.setuid = function(id) {
        throw new Error("process.setuid is not supported");
    };

    Object.defineProperty(Process.prototype, "stderr", {
        get: function() {
            throw new Error("process.stderr is not supported");
        },
        set: function() {
            throw new Error("process.stderr is not supported");
        }
    });

    Object.defineProperty(Process.prototype, "stdin", {
        get: function() {
            throw new Error("process.stderr is not supported");
        },
        set: function() {
            throw new Error("process.stderr is not supported");
        }
    });

    Object.defineProperty(Process.prototype, "stdout", {
        get: function() {
            throw new Error("process.stderr is not supported");
        },
        set: function() {
            throw new Error("process.stderr is not supported");
        }
    });

    return new Process();
}());
