var is = require('annois');

var get = require('./get');
var getAll = require('./get_all');
var models = require('./schema').models;
var operate = require('./utils/operate');


function remove(model, id, cb) {
    if(is.object(id)) {
        getAll(model, id, function(err, data) {
            cb(null, data.map(function(d) {
                d.deleted = true;

                return d;
            }));
        });
    }
    else {
        get(model, id, function(err, d) {
            var index = model._data.indexOf(d);
            var item;

            if(index >= 0) {
                item = model._data[index];
                item.deleted = true;

                // cascade deletion, not optimized
                models.forEach(function(m) {
                    m._data.forEach(function(data) {
                        var k, v;

                        for(k in d) {
                            v = d[k];

                            if(v === item._id) {
                                data.deleted = true;
                            }
                        }
                    });
                });
            }

            cb(null, item);
        });
    }
}
module.exports = operate(remove);
