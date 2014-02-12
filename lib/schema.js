var extend = require('extend');

var is = require('annois');

var models = [];


module.exports = function() {
    return function(parent, name) {
        return {
            fields: function(fields) {
                parent[name] = initMeta(initSchema(), fields);

                return parent[name];
            }
        };
    };

    function initSchema() {
        var ret = {};

        var context;
        ret.handlers = {
            pre: [],
            post: []
        };

        ret._data = [];

        // XXX: not guaranteed to be unique
        models.push(ret);

        ret.pre = function(fn) {
            context = 'pre';
            fn();
        };
        ret.post = function(fn) {
            context = 'post';
            fn();
        };
        ret.use = function(fn) {
            ret.handlers[context].push(fn);
        };

        return ret;
    }

    function initMeta(schema, fields) {
        var meta = extend({}, fields);

        Object.keys(meta).map(function(name) {
            var field = meta[name];

            if(is.fn(field)) {
                meta[name] = {
                    type: field
                };
            }
        });

        meta.created = {
            type: Date
        };

        schema.meta = meta;

        return schema;
    }
};
module.exports.models = models;
