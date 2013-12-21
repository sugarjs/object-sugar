var create = require('./create');
var getAll = require('./get_all');
var operate = require('./operate');


function getOrCreate(model, fields, cb) {
    getAll(model, fields, function(err, d) {
        if(d.length) {
            return cb(null, d[0]);
        }

        create(model, fields, function(err, d) {
            if(err) {
                return cb(err);
            }

            cb(null, d);
        });
    });
}
module.exports = operate(getOrCreate);
