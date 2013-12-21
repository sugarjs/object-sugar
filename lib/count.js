module.exports = function(model, cb) {
    cb(null, model._data.filter(function(item) {
        return !item.deleted;
    }).length);
};
