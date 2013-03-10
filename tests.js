#!/usr/bin/env node
var spec = require('sugar-spec');

var sugar = require('./lib/object-sugar');


main();

function main() {
    spec(sugar);
}
