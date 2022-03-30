const fs = require('fs');

module.exports = {
  getByVersion: function (version) {
    let changelog = fs.readFileSync('../changelog.md', 'utf8');
    let splitByVersions = changelog.split('\n---');
    let versionChangelog = splitByVersions.filter(function (item) {
      return item.includes('## ' + version);
    });
    return versionChangelog[0].replace('## ' + version + '\n', '');
  },

  getAll: function () {
    let changelogVersionObject = {};
    let changelog = fs.readFileSync('../changelog.md', 'utf8');
    let splitByVersions = changelog.split('\n---');
    splitByVersions.forEach(function (item) {
      if (item.includes('## ')) {
        let version = item.replace('## ', '');
        changelogVersionObject[version] = item.replace('## ' + version + '\n', '');
      }
    });
  }
}