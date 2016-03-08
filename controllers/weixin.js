var config = require('../config');
var crypto = require('../models/crypto.js');
var httpRequest = require('../models/httpRequest.js');
var xml = require('../models/xml.js');
var download = require('../models/download.js');
var weixin_event = require('./weixin_event.js');
require('../models/util.js');

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
    var url = 'https://api.weixin.qq.com/sns/oauth2/access_token?appid={0}&secret={1}&code=CODE&grant_type=authorization_code'.format(config.appID, config.appsecret);
    httpRequest.get(url, function (res) {
      var data = '';
      res.on('data', function (chunk) {
        data += chunk;
      });
      res.on('end', function () {
        data = JSON.parse(data);
        request.session.openId = data.openId;
        console.log(data.openId);
      });
    });
  }
}

function getAccessToken (success) {
  if(config.access_token && config.access_token_created_at) {
    if(config.access_token_created_at - new Date().getTime() < 7200000) {
      success(config.access_token);
      return;
    }
  }
  var url = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid={0}&secret={1}'.format(config.appID, config.appsecret);
  httpRequest.get(url, function (res) {
    var data = '';
    res.on('data', function (chunk) {
      data += chunk;
    });
    res.on('end', function () {
      data = JSON.parse(data);
      var date = new Date();
      config.access_token = data.access_token;
      config.access_token_created_at = date.getTime();
      success(data.access_token);
    });
  });
}

function weixinEvent (request, response, next) {
  xml.parseJSON(request.body, function (err, data) {
    var openId = data.xml.FromUserName[0];
    if(data.xml.Event) {
      switch(data.xml.Event[0]) {
        case "subscribe":
          weixin_event.subscribe(openId, data.xml);
          console.log(openId, 'subscribe');
        break;
        case "unsubscribe":
          weixin_event.unsubscribe(openId, data.xml);
          console.log(openId, 'unsubscribe');
        break;
      }
    }
    else if(data.xml.MsgType) {
      switch(data.xml.MsgType[0]) {
        case "text":
          weixin_event.text(openId, data.xml);
          console.log(openId, 'text', data.xml.Content[0]);
        break;
        case "image":
          weixin_event.image(openId, data.xml);
          console.log(openId, 'image', data.xml.PicUrl[0], data.xml.MediaId[0]);
        break;
        case "voice":
          weixin_event.voice(openId, data.xml);
          console.log(openId, 'voice', data.xml.MediaId[0]);
        break;
        case "video":
          weixin_event.video(openId, data.xml);
          console.log(openId, 'video', data.xml.MediaId[0], data.xml.ThumbMediaId[0]);
        break;
        case "shortvideo":
          weixin_event.shortvideo(openId, data.xml);
          console.log(openId, 'shortvideo', data.xml.MediaId[0], data.xml.ThumbMediaId[0]);
        break;
        case "location":
          weixin_event.location(openId, data.xml);
          console.log(openId, 'location');
        break;
        case "link":
          weixin_event.link(openId, data.xml);
          console.log(openId, 'link');
        break;
      }
    }

    response.end('');
  });
}

exports.checkSignature = checkSignature;
exports.weixinEvent = weixinEvent;
exports.getAccessToken = getAccessToken;