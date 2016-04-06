require('../models/util.js');
var pool = require('../models/pool.js');
var crypto = require('../models/crypto.js');
var config = require('../config');
var mail = require('../models/mail.js');

function deleteOutDateUser (uid) {
  pool.query({
    sql: 'delete from user where uid = {0}'.format(uid)
  });
}

exports.showLogin = function (request, response, next) {
  if(request.session.uid) {
    response.redirect('/');
  }
  else {
    response.render('login');
  }
};

exports.signOut = function (request, response, next) {
  if(request.session.uid) {
    delete(request.session.uid);
  }
  response.redirect('/');
};

exports.signIn = function (request, response, next) {
  pool.query({
    sql: 'select * from user where email = "{0}" or phone = "{0}"'.format(request.body.account),
    success: function (res) {
      var password = request.body.password;
      if(request.cookies.account && request.cookies.password) {
        password = crypto.decipher(config.algorithm, config.key, request.cookies.password);
      }
      if(!res.length) {
        response.json({isVerify: false, message: "用户不存在"});
      }
      else if(res[0].password !== password) {
        response.json({isVerify: false, message: "密码输入错误"});
      }
      else if(!res[0].email_verify) {
        response.json({isVerify: false, message: "未完成邮箱验证"});
      }
      else {
        var data = {isVerify: true, message: "验证成功"};
        var ip = request.connection.remoteAddress;
        ip = ip.length > 15 ? ip.slice(7) : ip;
        pool.query({sql: 'update user set last_login_ip = "{0}" where uid = "{1}"'.format(ip, res[0].uid)});
        request.session.uid = res[0].uid;
        request.session.name = res[0].name;
        request.session.head_img = res[0].head_img;
        if(request.body.remember) {
          response.cookie('account', '{0}'.format(request.body.account), {maxAge:5*24*60*60*1000});
          response.cookie('password', '{0}'.format(crypto.cipher(config.algorithm, config.key, password)), {maxAge:5*24*60*60*1000});
        }
        response.json(data);
      }
    }
  });
};

exports.signUp = function (request, response, next) {
  var created_at = new Date().format("YYYY-MM-DD hh:mm:ss");
  if(request.body)
  pool.query({
    sql: 'insert into user (`name`,`phone`,`email`,`password`, `created_at`) values("{0}","{1}","{2}","{3}","{4}")'.format(request.body.user, request.body.phone, request.body.email, request.body.password, created_at),
    success: function (res) {
      if(res) {
        var thisTime = new Date().getTime();
        var newMail = crypto.cipher(config.algorithm, config.key, request.body.email);
        var newName = crypto.cipher(config.algorithm, config.key, request.body.user);
        thisTime = crypto.cipher(config.algorithm, config.key, thisTime.toString());
        var verifyUrl = "http://{0}/login/verify?verifyStr={1}-{2}-{3}".format(config.mailHost, newMail, newName, thisTime);
        var subject = '阅读分享系统---readToShare 邮箱验证';
        var html = '<p>请务必在一小时内验证，一小时后链接将失效</p><br/><a href="{0}">Hi {1} ,点击验证邮箱,消息来自readToShare，阅读信息分享平台</a><br/><a href="http://mail.qq.com/cgi-bin/qm_share?t=qm_mailme&email=vM7V39TT0NmSxcn8zc2S39PR">如果有任何问题，欢迎点我发送邮件咨询</a>'.format(verifyUrl, request.body.user);
        mail.sendMail(request.body.email, subject, html);
        response.json({isSignUp: true, message: "验证邮件已发送到邮箱，请在1小时内点击里面的验证链接完成注册."});
      }
    },
    error: function (err) {
      if(err) {
        response.json({isSignUp: false, message: "注册失败"});
      }
    }
  });
};

exports.checkEmail = function (request, response, next) {
  pool.query({
    sql: 'select * from user where email = "{0}"'.format(request.query.email),
    success: function (res) {
      if(res.length) {
        var date = new Date(res[0].created_at).getTime();
        if(!res[0].email_verify && new Date().getTime() - date > 3600000) {
          deleteOutDateUser(res[0].uid);
          response.json({usable: true, message: "有效的邮箱地址"});
        }
        else {
          response.json({usable: false, message: "该邮箱已注册"});
        }
      }
      else {
        response.json({usable: true, message: "有效的邮箱地址"});
      }
    }
  });
};

exports.checkPhone = function (request, response, next) {
  pool.query({
    sql: 'select * from user where phone = "{0}"'.format(request.query.phone),
    success: function (res) {
      if(res.length) {
        var date = new Date(res[0].created_at).getTime();
        if(!res[0].email_verify && new Date().getTime() - date > 3600000) {
          deleteOutDateUser(res[0].uid);
          response.json({usable: true, message: "有效的手机号码"});
        }
        else {
          response.json({usable: false, message: "该手机号码已注册"});
        }
      }
      else {
        response.json({usable: true, message: "有效的手机号码"});
      }
    }
  });
};

exports.verifyMail = function (request, response, next) {
  var verifyStr = request.query.verifyStr;
  var arr = verifyStr.split('-');
  var mail = crypto.decipher(config.algorithm, config.key, arr[0]);
  var name = crypto.decipher(config.algorithm, config.key, arr[1]);
  var thisTime = parseInt(crypto.decipher(config.algorithm, config.key, arr[2]));
  if(new Date().getTime() - thisTime >= 3600000) {
    response.redirect('/login?type=verify&verify=false');
  }
  else {
    pool.query({
      sql: 'update user set email_verify = true where email = "{0}"'.format(mail),
      success: function (res) {
        if(res) {
          response.redirect('/login?type=verify&verify=true');
        }
      },
      error: function (err) {
        if(err) {
          response.redirect('/login?type=verifyverify=false');
        }
      }
    });
  }
};

exports.findVerify = function (request, response, next) {
  if(!request.body.phone || !request.body.email) {
    response.json({"isVerify": false, "message": "请输入手机号和邮箱"});
  }
  else {
    pool.query({
      sql: `select * from user where email = "${request.body.email}" and phone = "${request.body.phone}"`,
      success: function (res) {
        if(res.length) {
          var code = parseInt(Math.random()*1000000);
          request.session.verifyUid = res[0].uid;
          var html = `<html><p>您本次修改密码的验证是<strong>${code}</strong>，验证码只对本次修改有效。</p></html>`;
          var subject = "阅读信息分享平台---密码重置";
          mail.sendMail(request.body.email, subject, html);
          pool.query({sql: 'insert into identifyCode (`uid`,`code`) values("{0}", "{1}")'.format(res[0].uid, code)});
          response.json({"isVerify": true, "message": "验证码已经发送至邮箱，验证码只对本次修改有效"});
        }
        else {
          response.json({"isVerify": false, "message" :"验证错误, 手机与邮箱不对应"});
        }
      },
      error: function (err) {
        response.json({"isVerify": false, "message": "验证错误，手机与邮箱不对应"});
      }
    });
  }
};
exports.verifyIdentityCode = function (request, response, next) {
  if(request.session.verifyUid || request.body.code) {
    pool.query({
      sql: `select * from identifyCode where uid = ${request.session.verifyUid} and code = ${request.body.code} order by created_at desc limit 1;`,
      success: function (res) {
        if(res.length) {
          request.session.findVerify = true;
          response.json({"isVerify": true});
        }
        else {
          response.json({"isVerify": false, message: "验证码不正确"});
        }
      }
    });
  }
  else if (!request.body.code) {
    response.json({"isVerify": false, "message": "缺少参数code"});
  }
  else {
    response.json({"isVerify": false, "message": "请先输入手机号和邮箱进行验证"});
  }
};

exports.modifyPassword = function (request, response, next) {
  if(request.session.findVerify && request.body.password && request.session.verifyUid) {
    pool.query({
      sql: `update user set password = "${request.body.password}" where uid = "${request.session.verifyUid}"`,
      success: function (res) {
        if(res) {
          response.json({"isVerify": true, "message": "密码修改成功"});
        }
      },
      error: function (err) {
        if(err) {
          response.json({"isVerify": false, "message": "密码修改失败"});
        }
      }
    });
  }
  else if (!request.body.password) {
    response.json({"isVerify": false, "message": "缺少参数password"});
  }
  else {
    response.json({"isVerify": false, "message": "请先验证验证码"});
  }
};
