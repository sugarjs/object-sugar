var async = require('async');


module.exports = function(fn) {
    return function() {
        var args = Array.prototype.slice.call(arguments);
        var model = args[0];
        var handlers = model.handlers;
        var postHandlers = handlers.post || [];
        var preHandlers = handlers.pre || [];
        var cbIndex = args.length - 1;
        var cb = args[cbIndex];

        args[cbIndex] = function(err, data) {
            if(err || !model._post) {
                return cb(err, data);
            }

            evaluateHandlers(postHandlers.concat(finishHandlers), function(err, d) {
                model._post = true;

                cb(err, data);
            }, data);
        };

        if(model._pre) {
            fn.apply(undefined, args);
        }
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
