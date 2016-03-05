var nodemailer = require('nodemailer');
var crypto = require('../models/crypto.js');
var config = require('../config');
// 开启一个 SMTP 连接池
var smtpTransport = nodemailer.createTransport('SMTP',{
  host: 'smtp.qq.com', // 主机
  secureConnection: true, // 使用 SSL
  port: 465, // SMTP 端口
  auth: {
    user: 'richole.yu@qq.com', // 账号
    pass: 'exuqrjiltriybggf' // 密码
  }
});

exports.sendMail = function (mail, name) {
  // 设置邮件内容
  var thisTime = new Date().getTime();
  var newMail = crypto.cipher(config.algorithm, config.key, mail);
  var newName = crypto.cipher(config.algorithm, config.key, name);
  thisTime = crypto.cipher(config.algorithm, config.key, thisTime.toString());
  var verifyUrl = "http://{0}/login/verify?verifyStr={1}-{2}-{3}".format(config.mailHost, newMail, newName, thisTime);
  var mailOptions = {
    from: 'richole.yu@qq.com', // 发件地址
    to: mail, // 收件列表
    subject: '阅读分享系统---readToShare 邮箱验证', // 标题
    html: '<p>请务必在一小时内验证，一小时后链接将失效</p><br/><a href="{0}">Hi {1} ,点击验证邮箱,消息来自readToShare，阅读信息分享平台</a><br/><a href="http://mail.qq.com/cgi-bin/qm_share?t=qm_mailme&email=vM7V39TT0NmSxcn8zc2S39PR">如果有任何问题，欢迎点我发送邮件咨询</a>'.format(verifyUrl, name) // html 内容
  };
  // 发送邮件
  smtpTransport.sendMail(mailOptions, function(error, response){
    if(error){
      console.log(error);
    }
    else{
      console.log('Message sent: ' + response.message);
    }
    smtpTransport.close(); // 如果没用，关闭连接池
  });
}
// 邮箱联系我,连接http://mail.qq.com/cgi-bin/qm_share?t=qm_mailme&email=vM7V39TT0NmSxcn8zc2S39PR