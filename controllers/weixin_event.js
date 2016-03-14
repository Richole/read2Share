var config = require('../config');
var weixin = require('./weixin.js');
var request = require('request');
var fs = require("fs");
require('../models/util.js');

exports.subscribe = function (openId, response) {
  fs.readFile('../xml/subscribe.xml', function (err, file) {
    var data = file.toString().format(openId, config.weixinNumber, parseInt(new Date().getTime()/1000));
    console.log(data);
    response.end(data);
  });
};

exports.image = function (openId, xml) {
  weixin.getAccessToken(function (access_token) {
    var date = new Date();
    var url = 'https://api.weixin.qq.com/cgi-bin/media/get?access_token={0}&media_id={1}'.format(access_token, data.xml.MediaId[0]);
    var filePath = '{0}{1}-{2}.jpg'.format(config.pictureFolderPath, openId, date.format('YYYY-MM-DD_hh:mm:ss'));
    request(url).pipe(fs.createWriteStream(filePath));
  });
};