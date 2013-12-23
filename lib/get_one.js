var getAll = require('./get_all');
var operate = require('./utils/operate');


function getOne(model, query, cb) {
    getAll(model, query, function(err, d) {
        if(d.length > 0) {
            return cb(err, d[0]);
        }

        return cb(err, d);
    });
}
module.exports = operate(getOne);
