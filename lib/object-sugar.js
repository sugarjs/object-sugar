var async = require('async');
var funkit = require('funkit');
var is = require('is-js');

var ziptoo = funkit.functional.ziptoo;
var otozip = funkit.functional.otozip;
var filter = funkit.functional.filter;
var each = funkit.functional.each;
var fcount = funkit.functional.count;

var models = [];


function mixed() {
    return {type: 'mixed'};
}
exports.mixed = mixed;

function ref(name) {
    return {type: 'reference'};
}
exports.ref = ref;

function refs(name) {
    return {type: 'references'};
}
exports.refs = refs;

function schema(model) {
    return function(name, o) {
        var context;
        o.handlers = {
            pre: [],
            post: []
        };

        o.meta = Object.keys(o); // TODO: figure out a nice way to deal with this
        o._data = [];

        // XXX: not guaranteed to be unique
        models.push(o);

        o.pre = function(fn) {
            context = 'pre';
            fn();
        };
        o.post = function(fn) {
            context = 'post';
            fn();
        };
        o.use = function(fn) {
            o.handlers[context].push(fn);
        };

        return o;
    };
}
exports.schema = schema;

function getOrCreate(model, fields, cb) {
    getAll(model, fields, function(err, d) {
        if(d.length) return cb(null, d[0]);

        create(model, fields, function(err, d) {
            if(err) return cb(err);

            cb(null, d);
        });
    });
}
exports.getOrCreate = operate(getOrCreate);

function get(model, id, fields, cb) {
    var data = model._data.filter(function(k) {
        return k._id == id;
    });
    data = data.length? data[0]: {};

    if(data && is.array(fields) && fields.length) {
        fields.push('_id');
        data = ziptoo(otozip(data).filter(function(k) {
            if(fields.indexOf(k[0]) >= 0) return k;
        }));
    }

    if(is.set(cb)) cb(null, data);
    else fields(null, data);
}
exports.get = get;

function create(model, data, cb) {
    var ok = otozip(model.meta).filter(function(o) {
        var k = o[0];
        var v = o[1];

        if(is.set(v) && v.unique) {
            return filter(function(d) {
                return data[k] == d[k];
            }, model._data).length === 0;
        }

        return true;
    }).length === fcount(model.meta);

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
exports.create = operate(create);

function getOne(model, query, cb) {
    getAll(model, query, function(err, d) {
        if(d.length > 0) return cb(err, d[0]);

        return cb(err, d);
    });
}
exports.getOne = operate(getOne);

function getAll(model, query, cb) {
    if(!is.object(query) || fcount(query) === 0) {
        return is.fn(cb)? cb(null, model._data): query(null, model._data);
    }
    var fields = query.fields;
    var limit = query.limit;
    var offset = query.offset || 0;

    delete query.fields;
    delete query.limit;
    delete query.offset;

    var zq = otozip(query);
    var ret = model._data;

    if(fcount(query)) ret = ret.filter(function(o) {
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
            each(function(k, v) {
                model._data[index][k] = v;
            }, data);

            cb(null, model._data[index]);
        }
        else cb(null);
    });
}
exports.update = operate(update);

function removeAll(model, cb) {
    model._data.splice(0);

    cb(null, {});
}
exports.removeAll = operate(removeAll);

function remove(model, id, cb) {
    if(is.object(id)) {
        getAll(model, id, function(err, data) {
            cb(null, data.map(function(d) {
                d.deleted = true;

                return d;
            }));
        });
    }
    else {
        get(model, id, [], function(err, d) {
            var index = model._data.indexOf(d);
            var item = {};

            if(index >= 0) {
                item = model._data[index];
                item.deleted = true;

                // cascade deletion, not optimized
                models.forEach(function(m) {
                    m._data.forEach(function(d) {
                        var k, v;

                        for(k in d) {
                            v = d[k];

                            if(v == item._id) d.deleted = true;
                        }
                    });
                });
            }

            cb(null, item);
        });
    }
}
exports.remove = operate(remove);

function count(model, cb) {
    cb(null, model._data.filter(function(item) {
        return !item.deleted;
    }).length);
}
exports.count = count;

function getMeta(model, cb) {
    cb(null, model.meta);
}
exports.getMeta = getMeta;

function operate(fn) {
    return function() {
        var args = Array.prototype.slice.call(arguments);
        var model = args[0];
        var handlers = model.handlers;
        var postHandlers = handlers.post || [];
        var preHandlers = handlers.pre || [];
        var cbIndex = args.length - 1;
        var cb = args[cbIndex];

        args[cbIndex] = function(err, data) {
            if(err || !model._post) return cb(err, data);

            evaluateHandlers(postHandlers.concat(finishHandlers), function(err, d) {
                model._post = true;

                cb(err, data);
            }, data);
        };

        if(model._pre) fn.apply(undefined, args);
        else {
            evaluateHandlers(preHandlers, function() {
                model._pre = true;

                fn.apply(undefined, args);
            });
        }

        function finishHandlers() {
            model._pre = false;
            model._post = false;
        }
    };
}

function evaluateHandlers(handlers, done, data) {
    async.series(handlers.map(function(fn) {
        return function(cb) {
            fn(function(err) {
                cb(err, data);
            }, data);
        };
    }), done);
}
