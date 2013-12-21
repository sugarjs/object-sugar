var async = require('async');
var is = require('is-js');
var funkit = require('funkit');

var filter = funkit.functional.filter;
var fcount = funkit.functional.count;
var otozip = funkit.functional.otozip;

var operate = require('./operate');


function create(model, data, cb) {
    if(is.array(data)) {
        return createMultiple(model, data, cb);
    }

    createOne(model, data, cb);
}
function createMultiple(model, data, cb) {
    async.map(data, createOne.bind(null, model), cb);
}
function createOne(model, data, cb) {
    var ok = otozip(model.meta).filter(function(o) {
        var k = o[0];
        var v = o[1];

        if(is.set(v) && v.unique) {
            return filter(function(d) {
                return data[k] === d[k];
            }, model._data).length === 0;
        }

        return true;
    }).length === fcount(model.meta);

    if(ok) {
        // https://github.com/sperelson/genid-for-nodejs
        if(!('id' in model)) {
            data._id = new Date().getTime() - 1262304000000;
        }

        model._data.push(data);
        cb(null, data);
    }
    else {
        // XXX: should use err instead + fix error msg
        cb(null, {error: 'name was not unique!'});
    }
}
module.exports = operate(create);
