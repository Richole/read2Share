var request = require('request');
var config = require('../config.js');
var pool = require('../models/pool.js');
var fs = require('fs');

exports.showDetails = function (request, response, next) {
  var myfans = myCare = myMessages = 0;
  pool.query({
    sql: `select uid, count(*) as nums from care where uid = ${request.session.uid} or careId = ${request.session.uid} group by uid;`,
    success: function (res) {
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
        success: function (res) {

        }
      });
    }
  });
};

exports.showInfo = function (request, response, next) {
  response.render('info', {
      name: request.session.name,
      head_img: request.session.head_img
    }
  );
};

exports.updateImg = function (request, response, next) {
  var image = request.files.head_img;
  if(image) {
    var name = '{0}_{1}.{2}'.format(request.session.uid, new Date().getTime(), image.type.split('/')[1]);
    var address = config.pictureFolderPath + name;
    fs.rename(image.path, address);
    pool.query({
      sql: `update user set head_img = '/${name}' where uid = ${request.session.uid}`,
      success: function (res) {
        if(res) {
          response.json({"success": true, "head_img": `/${name}`});
        }
      }
    })
  }
  else {
    response.json({"success": false, "message": "缺少参数head_img"});
  }
};
