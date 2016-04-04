var nodemailer = require('nodemailer');
var config = require('../config');
// 开启一个 SMTP 连接池
var smtpTransport = nodemailer.createTransport('SMTP',{
  host: 'smtp.qq.com', // 主机
  secureConnection: true, // 使用 SSL
  port: 465, // SMTP 端口
  auth: {
    user: 'richole.yu@qq.com', // 账号
    pass: 'oaoilkvitfcibifa' // 密码
  }
});

exports.sendMail = function (mail, subject, html) {
  var mailOptions = {
    from: 'richole.yu@qq.com', // 发件地址
    to: mail, // 收件列表
    subject: subject, // 标题
    html: html
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
