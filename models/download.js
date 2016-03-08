var request = require('request');
var fs = require('fs');

exports.download = function (url, filePath) {
  request(url).pipe(fs.createWriteStream(filePath));
}