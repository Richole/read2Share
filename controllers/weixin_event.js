var config = require('../config');
var weixin = require('./weixin.js');
var request = require('request');
var fs = require("fs");
require('../models/util.js');

exports.subscribe = function (openId, xml, res) {

  var data = '';
  var readerStream = fs.createReadStream('../xml/subscribe.xml');
  readerStream.setEncoding('UTF8');
  readerStream.on('data', function(chunk) {
     data += chunk;
  });
  readerStream.on('end',function(){
     data.format(openId, config.weixinNumber, parseInt(new Date().getTime()/1000))
  });
  var xml = '<xml><ToUserName><![CDATA[{0}]]></ToUserName><FromUserName><![CDATA[{1}]]></FromUserName><CreateTime>{2}</CreateTime><MsgType><![CDATA[text]]></MsgType><Content><![CDATA[您好,欢迎关注阅读分享平台,在您的微信账号与平台账号绑定后,您可以直接给我发送信息发布最新动态<br/><a href="121.42.148.138">点击绑定微信账号</a>]]></Content></xml>'.format(openId, config.weixinNumber, parseInt(new Date().getTime()/1000));
  res.end(xml);
};

exports.image = function (openId, xml) {
  weixin.getAccessToken(function (access_token) {
    var date = new Date();
    var url = 'https://api.weixin.qq.com/cgi-bin/media/get?access_token={0}&media_id={1}'.format(access_token, data.xml.MediaId[0]);
    var filePath = '{0}{1}-{2}.jpg'.format(config.weixinPictureFolderPath, openId, date.format('YYYY-MM-DD_hh:mm:ss'));
    request(url).pipe(fs.createWriteStream(filePath));
  });
};