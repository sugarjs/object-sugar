var is = require('annois');
var funkit = require('funkit');
var zip = require('annozip');

var fcount = funkit.functional.count;


module.exports = function(model, query, cb) {
    if(!is.object(query) || fcount(query) === 0) {
        return is.fn(cb)? cb(null, model._data): query(null, model._data);
    }
    var fields = query.fields;
    var limit = query.limit;
    var offset = query.offset || 0;

    delete query.fields;
    delete query.limit;
    delete query.offset;

    var zq = zip(query);
    var ret = model._data;

    if(fcount(query)) {
        ret = ret.filter(function(o) {
            return zq.map(function(p) {
                return o[p[0]] === p[1];
            }).filter(funkit.id).length > 0;
        });
    }

    if(fields) {
        fields = is.array(fields)? fields: [fields];

        ret = ret.map(function(o) {
           var r = {};

            fields.forEach(function(k) {
                r[k] = o[k];
            });

            return r;
        });
    }

    if(limit) {
        ret = ret.slice(offset, offset + limit);
    }

    cb(null, ret);
};
