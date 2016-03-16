var config = require('../config');
var weixin = require('./weixin.js');
var request = require('request');
var pool = require('../models/pool.js');
var fs = require("fs");
require('../models/util.js');

exports.subscribe = function (openId, response) {
  fs.readFile('./xml/subscribe.xml', function (err, file) {
    if(err) {
      console.log(err);
    }
    var data = file.toString().format(openId, config.weixinNumber, parseInt(new Date().getTime()/1000));
    response.writeHead(200, {'Content-Type': 'application/xml'});
    response.end(data);
  });
};

exports.unsubscribe = function (openId, response) {
  response.end('');
};

exports.image = function (openId, xml) {
  pool.query({
    sql: 'select uid from user where open_id = "{0}"'.format(openId),
    success: function (res) {
      if(!res.length) {
        
      }
      else {
        var uid = res[0].uid;
        weixin.getAccessToken(function (access_token) {
          var url = 'https://api.weixin.qq.com/cgi-bin/media/get?access_token={0}&media_id={1}'.format(access_token, data.xml.MediaId[0]);
          var filePath = '{0}{1}_{2}_{3}.jpg'.format(config.pictureFolderPath, uid, new Date().getTime());
          request(url).pipe(fs.createWriteStream(filePath));
        });
      }
    }
  });

};