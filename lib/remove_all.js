var operate = require('./utils/operate');


function removeAll(model, cb) {
    model._data.splice(0);

    cb(null, {});
}
module.exports = operate(removeAll);
