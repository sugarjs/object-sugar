'use strict';

var is = require('annois');
var prop = require('annofp').prop;

var get = require('./get');
var getAll = require('./get_all');
var models = require('./schema').models;
var operate = require('./utils/operate');


function remove(model, id, o, cb) {
    if(is.fn(o)) {
        cb = o;
    }

    if(is.object(id)) {
        getAll(model, id, function(err, data) {
            if(o.hard) {
                var _ids = data.map(prop('_id'));

                model._data = model._data.filter(function(d) {
                    return _ids.indexOf(d._id) === -1;
                });
            }
            else {
                cb(null, data.map(function(d) {
                    d.deleted = true;

                    return d;
                }));
            }
        });
    }
    else {
        get(model, id, function(err, d) {
            var index = model._data.indexOf(d);
            var item;

            if(index >= 0) {
                if(o.hard) {
                    model._data.splice(index, 1);
                }
                else {
                    item = model._data[index];
                    item.deleted = true;
                }

                // cascade deletion, not optimized
                models.forEach(function(m) {
                    if(m !== model) {
                        m._data = m._data.filter(function(data) {
                            var k, v, deleted;

                            for(k in d) {
                                v = d[k];

                                if(v === item._id) {
                                    deleted = true;
                                    break;
                                }
                            }

                            if(o.hard) {
                                return !deleted;
                            }
                            else {
                                if(deleted) {
                                    data.deleted = true;
                                }

                                return true;
                            }
                        });
                    }
                });
            }

            cb(null, item);
        });
    }
}
module.exports = operate(remove);
