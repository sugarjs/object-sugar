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

suite(o.get, [

], {async: true});

suite(o.create, [

], {async: true});

suite(o.getAll, [

], {async: true});

suite(o.update, [

], {async: true});

suite(o['delete'], [

], {async: true});

suite(o.count, [

], {async: true});

suite(o.getMeta, [

]);

