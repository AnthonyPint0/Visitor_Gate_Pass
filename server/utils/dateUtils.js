const moment = require('moment');

function formatDateTime(date) {
  return moment(date).format('YYYY-MM-DD HH:mm:ss');
}

module.exports = formatDateTime
