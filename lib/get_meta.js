var extend = require('extend');
var is = require('annois');


module.exports = function(model, cb) {
    var meta = model.meta;
    var ret = {};

    Object.keys(meta).forEach(function(name) {
        var d = extend({}, meta[name]);

        if(is.fn(d.type)) {
            d.type = d.type.name;
        }

        ret[name] = d;
    });

    cb(null, ret);
};
