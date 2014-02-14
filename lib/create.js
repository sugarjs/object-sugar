var async = require('async');
var fp = require('annofp');
var is = require('annois');
var shortid = require('shortid').generate;

var getValid = require('./utils/get_valid');
var operate = require('./utils/operate');


function create(model, data, cb) {
    if(is.array(data)) {
        return createMultiple(model, data, cb);
    }

    createOne(model, data, cb);
}
function createMultiple(model, data, cb) {
    async.map(data, createOne.bind(null, model), cb);
}
function createOne(model, data, cb) {
    var meta = model.meta;
    var metaNames = Object.keys(meta);
    var fails = metaNames.filter(function(name) {
        var value = data[name];
        var field = meta[name];

        if(field.unique && value) {
            return fp.filter(function(d) {
                return value === d[name];
            }, model._data).length !== 0;
        }

        if(field.required && !(name in data)) {
            return true;
        }
    });

    if(!fails.length) {
        var validData = getValid(meta, data);

        if(!('id' in model)) {
            validData._id = shortid();
        }

        validData.created = new Date();

        model._data.push(validData);
        cb(null, validData);
    }
    else {
        cb(new Error('Failed to validate!', fails));
    }
}
module.exports = operate(create);
