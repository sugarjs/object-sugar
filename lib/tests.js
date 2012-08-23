#!/usr/bin/env node
var suite = require('suite.js');
var o = require('./object-sugar');

var schema = o.schema;
var refs = o.refs;

// test schemas
var license = schema('License', {
    name: {type: String, unique: true}
});

var lib = schema('Library', {
    name: {type: String, required: true},
    licenses: refs('License')
});

// TODO: test various queries + schema creation
suite();

