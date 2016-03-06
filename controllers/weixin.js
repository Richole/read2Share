var config = require('../config');
var crypto = require('../models/crypto.js');

function checkSignature (request, response, next) {
  var arr = [];
  var signature = request.query.signature;
  var timestamp = request.query.timestamp;
  var nonce = request.query.nonce;
  var echostr = request.query.echostr;
  arr.push(config.token, timestamp, nonce);
  arr.sort();
  var sha1Key = crypto.createHash('sha1', arr.join(''));
  if(sha1Key == signature) {
    response.end(echostr);
  }
  else {
    response.end("Error checkSignature request.");
  }
}

exports.checkSignature = checkSignature;