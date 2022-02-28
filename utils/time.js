module.exports = class {
  // note that you need to divide by 1000 and round to convert to unix timestamps
  static fullTimestamp(timestamp = Date.now()) {
    return "<t:" + Math.round(timestamp / 1000) + ":F>";
  }

  static timestamp(timestamp = Date.now(), type = "F") {
    return "<t:" + Math.round(timestamp / 1000) + ":" + type + ">";
  }
};
