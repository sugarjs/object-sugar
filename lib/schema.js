var models = [];


module.exports = function(engine) {
    return function(parent, name) {
        return {
            fields: function(o) {
                parent[name] = init(name, o);

                return parent[name];
            }
        };
    };

    function init(name, o) {
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
    }
}
module.exports.models = models;
