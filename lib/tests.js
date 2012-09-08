#!/usr/bin/env node
var suite = require('suite.js');
var o = require('./object-sugar');

suite(o.get, [

], {async: true});

(function() {
    var li = license();
    var lib = library();

    li.id = null;
    lib.id = null;

    suite(o.create, [
        [li, {name: 'foobar'}], {name: 'foobar'},
        [li, {name: 'foobar'}], {error: 'name was not unique!'}, // XXX: trig err!
        [lib, {name: 'gpl'}], {name: 'gpl'}
    ], {async: true});
})();

(function() {
    var li = license();
    var lib = library();

    li.id = null;
    lib.id = null;

    o.create(li, {name: 'gorilla'}, function() {
        o.create(li, {name: 'giraffe'}, function() {
            suite(o.getAll, [
                [li, {}], [{name: 'gorilla'}, {name: 'giraffe'}],
                [li, {name: 'gorilla'}], [{name: 'gorilla'}],
                [li, {limit: 1}], [{name: 'gorilla'}],
                [li, {limit: 1, offset: 1}], [{name: 'giraffe'}]
            ], {async: true});
        });
    });

    o.create(lib, {name: 'object-sugar', version: 1}, function() {
        suite(o.getAll, [
            [lib, {fields: ['version']}], [{version: 1}],
            [lib, {name: 'object-sugar', fields: ['version']}], [{version: 1}]
        ], {async: true});
    });
})();

(function() {
    var li = license();

    o.create(li, {name: 'gorilla'}, function(err, d) {
        var id = d._id;

        suite(o.get, [
            [li, id, []], {name: 'gorilla', _id: id},
            [li, id, ['name']], {name: 'gorilla'},
            [li, id - 1, {}], {}
        ], {async: true});
    });
})();

(function() {
    var li = license();

    o.create(li, {name: 'gorilla'}, function(err, d) {
        suite(o.update, [
            [li, d._id, {name: 'zebra'}], {name: 'zebra', _id: d._id}
        ], {async: true});
    });
})();

(function() {
    var li = license();

    o.create(li, {name: 'bear'}, function(err, d) {
        o['delete'](li, d._id, function(err, d) {
            suite(o.count, [
                [li], 0
            ], {async: true});
        });
    });
})();

(function() {
    var lib = library();
    var li = license();

    suite(o.count, [
        [lib], 0
    ], {async: true});

    o.create(li, {name: 'zebra'}, function() {
        suite(o.count, [
            [li], 1
        ], {async: true});

        o.create(li, {name: 'bear'}, function() {
            suite(o.count, [
                [li], 2
            ], {async: true});
        });
    });
})();

(function() {
    var li = license();
    var lib = library();

    suite(o.getMeta, [
        li, {name: {type: String, unique: true}},
        lib, {
            name: {
                type: String, required: true
            },
            version: {
                type: Number
            },
            licenses: {
                type: 'reference'
            }
        }
    ]);
})();

// test schemas
function license() {
    return o.schema('License', {
        name: {type: String, unique: true}
    });
}

function library() {
    return o.schema('Library', {
        name: {type: String, required: true},
        version: {type: Number},
        licenses: o.refs('License')
    });
}
