// Aggregates all the other util modules into one package and export that.

const time = require("./time.js");
const paginator = require("./paginator.js");
const deploy = require("./deploy.js");
const confirm = require("./confirm.js");
const error = require("./error.js");
const uuid = require("./uuid.js");
const changelog = require("./changelog.js");
const bridges = require("./bridge.js");
const misc = require("./misc.js");

module.exports = {
  time: time,
  paginator: paginator,
  deploy: deploy,
  confirm: confirm,
  errors: error,
  uuid: uuid,
  changelog: changelog,
  bridges: bridges,
  misc: misc
};
