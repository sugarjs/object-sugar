var async = require('async');
var funkit = require('funkit');
var is = require('is-js');

var each = funkit.functional.each;

var get = require('./get');
var operate = require('./operate');


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
            each(function(k, v) {
                model._data[index][k] = v;
            }, data);

            cb(null, model._data[index]);
        }
        else {
            cb(null);
        }
    });
}
module.exports = operate(update);
