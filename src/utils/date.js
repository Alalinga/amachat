const getDate = () => {
    var dateTime = require('node-datetime');
    var dt = dateTime.create();
    var formatted = { date: dt.format('Y-m-d'), time: dt.format('H:M') };
    return formatted
}

module.exports = {getDate}