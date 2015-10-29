var EventEmitter = require("event_emitter"),
    environment = require("environment"),
    asap = require("asap"),
    now = require("now");


var window = environment.window,
    navigator = window.navigator,
    location = window.location,

    reArch = /\b(?:AMD|IA|Win|WOW|x86_|x)[32|64]+\b/i,
    rePlatform = /[ \s]+/,

    ProcessPrototype;


function Process() {

    EventEmitter.call(this, -1);

    this.pid = 0;
    this.browser = true;
    this.title = "browser";
    this.env = {};
    this.argv = [];
    this.version = "1.0.0";
    this.versions = {};
    this.config = {};
    this.execPath = ".";
    this.execArgv = [];
    this.arch = getArch();
    this.platform = getPlatform();
    this.maxTickDepth = 1000;
    this.__cwd = location ? location.pathname : "/";
}
EventEmitter.extend(Process);
ProcessPrototype = Process.prototype;

function Memory(rss, heapTotal, heapUsed) {
    this.rss = rss;
    this.heapTotal = heapTotal;
    this.heapUsed = heapUsed;
}

ProcessPrototype.memoryUsage = (function() {
    var performance = window.performance || {};

    performance.memory || (performance.memory = {});

    return function memoryUsage() {
        return new Memory(
            performance.memory.jsHeapSizeLimit || 0,
            performance.memory.totalJSHeapSize || 0,
            performance.memory.usedJSHeapSize || 0
        );
    };
}());

ProcessPrototype.nextTick = asap;

ProcessPrototype.cwd = function() {
    return this.__cwd;
};

ProcessPrototype.chdir = function(dir) {
    var cwd = location ? location.pathname : "/",
        length, newDir;

    if (dir === "/") {
        newDir = "/";
    } else {
        length = cwd.length;
        newDir = dir.length >= length ? dir : dir.substring(0, length) + "/";
    }

    if (cwd.indexOf(newDir) === 0) {
        this.__cwd = dir;
    } else {
        throw new Error("process.chdir can't change to directory " + dir);
    }
};

ProcessPrototype.hrtime = function(previousTimestamp) {
    var clocktime = now() * 1e-3,
        seconds = clocktime | 0,
        nanoseconds = ((clocktime % 1) * 1e9) | 0;

    if (previousTimestamp) {
        seconds = seconds - previousTimestamp[0];
        nanoseconds = nanoseconds - previousTimestamp[1];

        if (nanoseconds < 0) {
            seconds--;
            nanoseconds += 1e9;
        }
    }

    return [seconds, nanoseconds];
};

ProcessPrototype.uptime = function() {
    return now() * 1e-3;
};

ProcessPrototype.abort = function() {
    throw new Error("process.abort is not supported");
};

ProcessPrototype.binding = function() {
    throw new Error("process.binding is not supported");
};

ProcessPrototype.umask = function() {
    throw new Error("process.umask is not supported");
};

ProcessPrototype.kill = function() {
    throw new Error("process.kill is not supported");
};

ProcessPrototype.initgroups = function() {
    throw new Error("process.initgroups is not supported");
};

ProcessPrototype.setgroups = function() {
    throw new Error("process.setgroups is not supported");
};

ProcessPrototype.getgroups = function() {
    throw new Error("process.getgroups is not supported");
};

ProcessPrototype.getuid = function() {
    throw new Error("process.getuid is not supported");
};

ProcessPrototype.setgid = function() {
    throw new Error("process.setgid is not supported");
};

ProcessPrototype.getgid = function() {
    throw new Error("process.getgid is not supported");
};

ProcessPrototype.exit = function() {
    throw new Error("process.exit is not supported");
};

ProcessPrototype.setuid = function() {
    throw new Error("process.setuid is not supported");
};

ProcessPrototype.stderr = null;
ProcessPrototype.stdin = null;
ProcessPrototype.stdout = null;


function getArch() {
    if (navigator && navigator.userAgent) {
        return ((reArch.exec(navigator.userAgent) || "")[0] || "unknown").replace(/86_/i, "").toLowerCase();
    } else {
        return "unknown";
    }
}

function getPlatform() {
    if (navigator && navigator.platform) {
        return (navigator.platform.split(rePlatform)[0] || "unknown").toLowerCase();
    } else {
        return "unknown";
    }
}


module.exports = new Process();
