var config = require('../config');
var crypto = require('../models/crypto.js');
var xml = require('../models/xml.js');
var weixin_event = require('./weixin_event.js');
var httpRequest = require('request');
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
    httpRequest(url, function (err, res, body) {
      var data = JSON.parse(body);
      request.session.openId = data.openId;
      console.log(data.openId);
    })
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
  httpRequest(url, function (err, res, body) {
    var data = JSON.parse(body);
    var date = new Date();
    config.access_token = data.access_token;
    config.access_token_created_at = date.getTime();
    success(config.access_token);
  })
}

function weixinEvent (request, response, next) {
  console.log(request.body);
  xml.parseJSON(request.body, function (err, data) {
    var openId = data.xml.FromUserName[0];
    console.log(data.xml,data.xml.toString());
    if(data.xml.Event) {
      switch(data.xml.Event[0]) {
        case "subscribe":
          weixin_event.subscribe(openId, response);
        break;
        case "unsubscribe":
          console.log(openId, 'unsubscribe');
          weixin_event.unsubscribe(openId);
          response.end('');
        break;
      }
    }
    else if(data.xml.MsgType) {
      switch(data.xml.MsgType[0]) {
        case "text":
          console.log(openId, 'text', data.xml.Content[0]);
          weixin_event.text(openId, data.xml);
        break;
        case "image":
          console.log(openId, 'image', data.xml.PicUrl[0], data.xml.MediaId[0]);
          weixin_event.image(openId, data.xml);
        break;
        case "voice":
          console.log(openId, 'voice', data.xml.MediaId[0]);
          weixin_event.voice(openId, data.xml);
        break;
        case "video":
          console.log(openId, 'video', data.xml.MediaId[0], data.xml.ThumbMediaId[0]);
          weixin_event.video(openId, data.xml);
        break;
        case "shortvideo":
          console.log(openId, 'shortvideo', data.xml.MediaId[0], data.xml.ThumbMediaId[0]);
          weixin_event.shortvideo(openId, data.xml);
        break;
        case "location":
          console.log(openId, 'location');
          weixin_event.location(openId, data.xml);
        break;
        case "link":
          console.log(openId, 'link');
          weixin_event.link(openId, data.xml);
        break;
        case "scan":
          console.log(data.xml,data.xml.toString(), "scan");
        case "scancode_push":
          console.log(data.xml,data.xml.toString(), "scancode_push");
      }
      response.end('');
    }
  });
}

exports.checkSignature = checkSignature;
exports.weixinEvent = weixinEvent;
exports.getAccessToken = getAccessToken;