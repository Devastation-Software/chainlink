const fs = require('fs');
const uuid = require('./uuid');

module.exports = {
    write: function (err) {
        let errors = fs.readFileSync('errors.json', { encoding: 'utf8' });
        errors = JSON.parse(errors);

        let randomUUID = uuid.generate();

        let errorStructure = {
          date: Date.now(),
          error: err,
          stack: err.stack,
          id: "err-" + randomUUID
        }

        errors.push(errorStructure);
        errors = JSON.stringify(errors);
        fs.writeFileSync('errors.json', errors);
        return "err-" + randomUUID;
    },

    loadAll: function () {
        let errors = fs.readFileSync('errors.json', { encoding: 'utf8' });
        errors = JSON.parse(errors);
        return errors;
    },

    loadByErrorId: function (id) {
        let errors = fs.readFileSync('errors.json', { encoding: 'utf8' });
        errors = JSON.parse(errors);
        return errors.find(error => error.id === id);
    },

    count: function () {
        let errors = fs.readFileSync('errors.json', { encoding: 'utf8' });
        errors = JSON.parse(errors);
        return errors.length;
    },
}