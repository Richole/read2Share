var request = require('request');
var config = require('../config.js');
var pool = require('../models/pool.js');

exports.showInfo = (request, response, next) => {
  if(request.session.uid) {
    response.render('info', {
        name: request.session.name,
        head_img: request.session.head_img
      }
    );
  }
  else {
    response.redirect('/login');
  }
};

exports.showDetails = (request, response, next) => {
  if(request.session.uid) {
    var myfans = myCare = myMessages = 0;
    pool.query({
      sql: `select uid, count(*) as nums from care where uid = ${request.session.uid} or careId = ${request.session.uid} group by uid;`,
      success: res => {
        if(res.length) {
          for(var i = 0; i < res.length; i++) {
            if(item.uid == request.session.uid) {
              myCare = item.nums;
            }
          }
          myfans = (myCare !== 0) ? res.length - 1 : res.length;
        }
        pool.query({
          sql: ``,
          success: res => {

          }
        });
      }
    });
  }
  else {
    response.json({"isSuccess": false, message: "请先登录验证"});
  }
};