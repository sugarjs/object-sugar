var is = require('annois');
var zip = require('annozip');


module.exports = function(model, id, fields, cb) {
    id = parseInt(id, 10);

    var data = model._data.filter(function(k) {
        return k._id === id;
    });
    data = data.length? data[0]: {};

    if(data && is.array(fields) && fields.length) {
        fields.push('_id');

        data = zip.toObject(zip(data).filter(function(k) {
            if(fields.indexOf(k[0]) >= 0) {
                return k;
            }
        }));
    }

    if(is.defined(cb)) {
        cb(null, data);
    }
    else {
        fields(null, data);
    }
};
