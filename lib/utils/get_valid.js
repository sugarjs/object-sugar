module.exports = function(meta, data) {
    var ret = {};

    Object.keys(data).forEach(function(name) {
        if(name in meta) {
            ret[name] = data[name];
        }
    });

    ret._id = data._id;

    return ret;
};
