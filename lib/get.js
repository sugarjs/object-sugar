var funkit = require('funkit');
var is = require('is-js');

var otozip = funkit.functional.otozip;
var ziptoo = funkit.functional.ziptoo;


module.exports = function(model, id, fields, cb) {
    id = parseInt(id, 10);

    var data = model._data.filter(function(k) {
        return k._id === id;
    });
    data = data.length? data[0]: {};

    if(data && is.array(fields) && fields.length) {
        fields.push('_id');

        data = ziptoo(otozip(data).filter(function(k) {
            if(fields.indexOf(k[0]) >= 0) {
                return k;
            }
        }));
    }

    if(is.set(cb)) {
        cb(null, data);
    }
    else {
        fields(null, data);
    }
}
