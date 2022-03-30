const fs = require('fs');
const uuid = require('./uuid');

module.exports = {
    write: function (err) {
        let errors = fs.readFileSync('errors.json', { encoding: 'utf8' });
        errors = JSON.parse(errors);

        let errorStructure = {
          date: new Date(),
          error: err,
          stack: err.stack,
          id: uuid.generate()
        }

        errors.push(errorStructure);
        errors = JSON.stringify(errors);
        fs.writeFileSync('errors.json', errors);
        return;
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
    }

}