const api = new (require("minehut-api"))();
module.exports = {api};
module.exports.web = require("./web");
module.exports.discord = require("./discord");