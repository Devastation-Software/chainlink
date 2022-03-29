// Aggregates all the other util modules into one package and export that.

const time = require("./time.js");
const paginator = require("./paginator.js");
const deploy = require("./deploy.js");
const confirm = require("./confirm.js");

module.exports = {
  time: time,
  paginator: paginator,
  deploy: deploy,
  confirm: confirm,
};
