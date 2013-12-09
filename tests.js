#!/usr/bin/env node
var spec = require('sugar-spec');

var sugar = require('./');


main();

function main() {
    spec({
        sugar: sugar
    });
}
