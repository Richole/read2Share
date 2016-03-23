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
      else if(res[0].password != password) {
        response.json({isVerify: false, message: "密码输入错误"});
      }
      else if(!res[0].email_verify) {
        response.json({isVerify: false, message: "未完成邮箱验证"});
      }
      else {
        var data = {isVerify: true, message: "验证成功"};
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
  var created_at = new Date().format("YYYY-MM-DD hh:mm:ss");;
  if(request.body)
  pool.query({
    sql: 'insert into user (`name`,`phone`,`email`,`password`, `created_at`) values("{0}","{1}","{2}","{3}","{4}")'.format(request.body.user, request.body.phone, request.body.email, request.body.password, created_at),
    success: function (res) {
      if(res) {
        mail.sendMail(request.body.email, request.body.user);
        response.json({isSignUp: true, message: "验证邮件已发送到邮箱，请在1小时内点击里面的验证链接完成注册."});
      }
    },
    error: function (err) {
      if(err) {
        response.json({isSignUp: false, message: "注册失败"});
      }
    }
  })
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
    response.render('login?verify=false');
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
