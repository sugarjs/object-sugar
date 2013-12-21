var async = require('async');
var fp = require('annofp');
var is = require('annois');

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
    var ok = model.meta.filter(function(o) {
        var k = o[0];
        var v = o[1];

        if(is.defined(v) && v.unique) {
            return fp.filter(function(d) {
                return data[k] === d[k];
            }, model._data).length === 0;
        }

        return true;
    }).length === fp.count(model.meta);

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
