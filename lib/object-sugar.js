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
    var data = model._data.filter(function(k) {
        return k._id == id;
    });
    data = data.length? data[0]: {};

    if(data && fields.length) {
        data = funkit.ziptoo(funkit.otozip(data).filter(function(k) {
            if(fields.indexOf(k[0]) >= 0) return k;
        }));
    }

    cb(null, data);
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
        // https://github.com/sperelson/genid-for-nodejs
        if(!('id' in model)) data._id = new Date().getTime() - 1262304000000;
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
    if(!funkit.isObject(query) || funkit.count(query) === 0) return cb(null, model._data);
    var fields = query.fields;
    var limit = query.limit;
    var offset = query.offset || 0;

    delete query.fields;
    delete query.limit;
    delete query.offset;

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

    if(limit) ret = ret.slice(offset, offset + limit);

    cb(null, ret);
}
exports.getAll = getAll;

function update(model, id, data, cb) {
    get(model, id, [], function(err, d) {
        var index = model._data.indexOf(d);

        if(index >= 0) {
            funkit.forEach(data, function(k, v) {
                model._data[index][k] = v;
            });

            cb(null, model._data[index]);
        }
        else cb(null);
    });
}
exports.update = update;

function del(model, id, cb) {
    get(model, id, [], function(err, d) {
        var index = model._data.indexOf(d);

        if(index >= 0) {
            model._data.splice(index, 1);
        }

        cb(null, {});
    });
}
exports['delete'] = del;

function count(model, cb) {
    cb(null, model._data.length);
}
exports.count = count;

function getMeta(model) {
    return model.meta;
}
exports.getMeta = getMeta;

