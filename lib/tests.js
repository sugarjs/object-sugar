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
suite();

// create
suite();

// getAll
suite();

// update
suite();

// delete
suite();

// count
suite();

// getMeta
suite();

