#!/usr/bin/env node
var suite = require('suite.js');
var o = require('./object-sugar');

suite(o.get, [

], {async: true});

(function() {
    var li = license();

    suite(o.create, [
        [li, {name: 'foobar'}], {name: 'foobar'},
        [li, {name: 'foobar'}], {error: 'name was not unique!'}, // XXX: trig err!
        [library(), {name: 'gpl'}], {name: 'gpl'}
    ], {async: true});
})();

(function() {
    var li = license();

    o.create(li, {name: 'gorilla'}, function() {
        o.create(li, {name: 'giraffe'}, function() {
            suite(o.getAll, [
                [li, {}], [{name: 'gorilla'}, {name: 'giraffe'}],
                [li, {name: 'gorilla'}], [{name: 'gorilla'}]
            ], {async: true});
        });
    });
})();

suite(o.update, [

], {async: true});

suite(o['delete'], [

], {async: true});

suite(o.count, [

], {async: true});

/*
suite(o.getMeta, [
    license(), {name: {type: String, unique: true}},
    library(), {
        name: {
            type: String, required: true
        },
        licenses: {
            type: 'reference'
        }
    }
]);*/

// test schemas
function license() {
    return o.schema('License', {
        name: {type: String, unique: true}
    });
}

function library() {
    return o.schema('Library', {
        name: {type: String, required: true},
        licenses: o.refs('License')
    });
}
