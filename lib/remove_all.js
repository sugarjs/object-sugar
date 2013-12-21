var operate = require('./operate');


function removeAll(model, cb) {
    model._data.splice(0);

    cb(null, {});
}
module.exports = operate(removeAll);
