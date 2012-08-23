#!/usr/bin/env node
var suite = require('suite.js');
var o = require('./object-sugar');

// test schemas
var license = o.schema('License', {
    name: {type: String, unique: true}
});

var lib = o.schema('Library', {
    name: {type: String, required: true},
    licenses: o.refs('License')
});

// get
suite(o.get);

// create
suite(o.create);

// getAll
suite(o.getAll);

// update
suite(o.update);

// delete
suite(o['delete']);

// count
suite(o.count);

// getMeta
suite(o.getMeta);

