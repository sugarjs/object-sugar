var funkit = require('funkit');

function refs(name) {
    return {type: 'reference'};
}
exports.refs = refs;

function schema(name, o) {
    o.meta = funkit.deepcopy(o);
    o._data = [];

    return o;
}
exports.schema = schema;

function get(model, id, fields, cb) {

}
exports.get = get;

function create(model, data, cb) {
    var ok = funkit.otozip(model.meta).filter(function(o) {
        var k = o[0];
        var v = o[1];

        if(funkit.isDefined(v) && v.unique) {
            return funkit.filter(function(d) {
                return data[k] == d[k];
            }, model._data).length === 0;
        }

        return true;
    }).length === funkit.count(model.meta);

    if(ok) {
        model._data.push(data);
        cb(null, data);
    }
    else {
        // XXX: should use err instead + fix error msg
        cb(null, {error: 'name was not unique!'});
    }
}
exports.create = create;

function getAll(model, query, cb) {
    // TODO: limit, offset
    if(!funkit.isObject(query) || funkit.count(query) === 0) return cb(null, model._data);
    var fields = query.fields;

    delete query.fields;

    var zq = funkit.otozip(query);
    var ret = model._data;

    if(funkit.count(query)) ret = ret.filter(function(o) {
        return zq.map(function(p) {
            return o[p[0]] == p[1];
        }).filter(funkit.id).length > 0;
    });

    if(fields) ret = ret.map(function(o) {
        var r = {};

        fields.forEach(function(k) {
            r[k] = o[k];
        });

        return r;
    });

    cb(null, ret);
}
exports.getAll = getAll;

function update(model, id, data, cb) {

}
exports.update = update;

function del(model, id, cb) {

}
exports['delete'] = del;

function count(model, cb) {

}
exports.count = count;

function getMeta(model) {
    return model.meta;
}
exports.getMeta = getMeta;

