var config = require('../config');
var weixin = require('./weixin.js');
var download = require('../models/download.js');
var httpRequest = require('../models/httpRequest.js');
require('../models/util.js');

exports.subscribe = function (openId, xml) {
  weixin.getAccessToken(function (access_token) {
    var data = {
      touser: openId,
      msgtype: 'text',
      text: {
        content: '您好,欢迎关注阅读分享平台,在您的微信账号与平台账号绑定后,您可以直接给我发送信息发布最新动态<br/><a href="121.42.148.138">点击绑定微信账号</a>'
      }
    };
    request.post({
        url:'https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token=RB9-mhU2G2cO36SoNf8xTsb3u9s160rQcLTPu1ZqzqeMfQM3s_WRAeU7zj9_VVRVbdWLDMu31OieRoMMccYelwFrpw4NPW-T3LDLYI8WNdgWXkxB0k-gWLU87jEUYK4OEKXaAIAKQD',
        form: {key:'value'}
      }, function(err, httpResponse, body){
        console.log(body);
    });

  });
};

exports.image = function (openId, xml) {
  weixin.getAccessToken(function (access_token) {
    var date = new Date();
    var url = 'https://api.weixin.qq.com/cgi-bin/media/get?access_token={0}&media_id={1}'.format(access_token, data.xml.MediaId[0]);
    download.download(url, '{0}{1}-{2}.jpg'.format(config.weixinPictureFolderPath, openId, date.format('YYYY-MM-DD_hh:mm:ss')));
  });
};