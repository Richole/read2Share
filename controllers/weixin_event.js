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
    console.log(data);
    data.format(openId, config.weixinNumber, parseInt(new Date().getTime()/1000));
    console.log(data);
    res.end(data);
  });
 
  
};

exports.image = function (openId, xml) {
  weixin.getAccessToken(function (access_token) {
    var date = new Date();
    var url = 'https://api.weixin.qq.com/cgi-bin/media/get?access_token={0}&media_id={1}'.format(access_token, data.xml.MediaId[0]);
    var filePath = '{0}{1}-{2}.jpg'.format(config.weixinPictureFolderPath, openId, date.format('YYYY-MM-DD_hh:mm:ss'));
    request(url).pipe(fs.createWriteStream(filePath));
  });
};