if (typeof(process) !== "undefined") {
    module.exports = process;
} else {
    module.exports = require("./process");
}
