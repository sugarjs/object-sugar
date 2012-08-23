var funkit = require('funkit');

function refs(name) {

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
    var ok = funkit.values(funkit.map(function(k) {
        if(!funkit.isDefined(k)) return true;

        if(k.unique) {
            return funkit.map(function(d) {
                return data[k] == d[k];
            }, model._data).filter(funkit.id).length === 0;
        }

        return true;
    }, model.meta)).filter(funkit.id).length === funkit.count(model.meta);

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

