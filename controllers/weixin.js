var config = require('../config');
var crypto = require('../models/crypto.js');
var httpRequest = require('../models/httpRequest.js');
var xml = require('xml');

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

function authorize (request, response, next) {
  var code = request.query.code;
  if(!code) {
    response.end({error: 'can not get code from url'});
  }
  else {
    var url = 'https://api.weixin.qq.com/sns/oauth2/access_token?appid={0}&secret={1}&code=CODE&grant_type=authorization_code'.format(config.appid, config.appsecret);
    httpRequest.get(url, function (res) {
      var data = '';
      res.on('data', function (chunk) {
        data += chunk;
      });
      res.on('end', function () {
        data = JSON.parse(data);
        request.session.openid = data.openid;
        console.log(data.openid);
      });
    });
  }
}

function getAccessToken (request, response, next) {
  var url = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid={0}&secret={1}'.format(config.appid, config.appsecret);
  httpRequest.get(url, function (res) {
    var data = '';
    res.on('data', function (chunk) {
      data += chunk;
    });
    res.on('end', function () {
      var date = new Date();
      data = JSON.parse(data);
      config.access_token = data.access_token;
      config.access_token_created_at = date.getTime();
    });
  });
}

function weixinEvent (request, response, next) {
  xml.parseJSON(request.body, function (data) {
    var openId = data.xml.FromUserName[0];
    switch(data.xml.Event[0]) {
      case "subscribe":
        console.log(openId, 'subscribe');
      break;
      case "unsubscribe":
        console.log(openId, 'unsubscribe');
      break;
    }
    response.end('');
  });
}

exports.checkSignature = checkSignature;
exports.bindAccount = bindAccount;