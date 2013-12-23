var async = require('async');
var fp = require('annofp');
var is = require('annois');

var get = require('./get');
var operate = require('./utils/operate');
var getValid = require('./utils/get_valid');


function update(model, ids, data, cb) {
    if(is.array(ids)) {
        return updateMultiple(model, ids, data, cb);
    }

    updateOne(model, ids, data, cb);
}
function updateMultiple(model, ids, data, cb) {
    async.map(ids, function(id, cb) {
        updateOne(model, id, data, cb);
    }, cb);
}
function updateOne(model, ids, data, cb) {
    get(model, ids, [], function(err, d) {
        var index = model._data.indexOf(d);

        if(index >= 0) {
            fp.each(function(k, v) {
                model._data[index][k] = v;
            }, data);

            cb(null, getValid(model.meta, model._data[index]));
        }
        else {
            cb(null);
        }
    });
}
module.exports = operate(update);

