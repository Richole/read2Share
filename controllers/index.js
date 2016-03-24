var request = require('request');
var config = require('../config.js');
var pool = require('../models/pool.js');
var fs = require("fs");
config.pictureFolderPath = "/home/richole/Pictures/";

exports.showIndex = function (request, response, next) {
  if(request.session.uid) {
    response.render(
      'index',
      {
        name: request.session.name,
        head_img: request.session.head_img
      }
    );
  }
  else {
    response.redirect('/login');
  }
};

exports.userMessage = function (request, response, next) {
  var images = request.files.images;
  var musics = request.files.musics;
  var videos = request.files.videos;
  var isArray = request.files.images.length != undefined;
  var hasImage = isArray || images.size;
  request.body.text = request.body.text || "";

  if(!hasImage && !musics.size && !videos.size) {
    var sql = 'insert into message (`uid`,`text`,`image_url`, `video_url`,`thumb_video_url`, `music_url`, `come_from`) values("{0}","{1}","{2}","{3}","{4}", "{5}", "{6}")'.format(request.session.uid, encodeURIComponent(request.body.text), '', '', '', '', 'WeiBo');
    pool.query({sql: sql, response: response});
  }
  else if (hasImage && isArray) {
    var arr = [];
    for(var i in images) {
      var name = '{0}_{1}{2}.{3}'.format(request.session.uid, new Date().getTime(), i, images[i].type.split('/')[1]);
      var address = config.pictureFolderPath + name;
      arr.push('/'+ name);
      fs.rename(images[i].path, address);
    }
    var sql = 'insert into message (`uid`,`text`,`image_url`, `video_url`,`thumb_video_url`, `music_url`, `come_from`) values("{0}","{1}","{2}","{3}","{4}", "{5}", "{6}")'.format(request.session.uid, encodeURIComponent(request.body.text), arr.join('###'), '', '', '', 'WeiBo');
    pool.query({sql: sql, response: response});
  }
  else if (hasImage && !isArray) {
    if(images.size) {
      var name = '{0}_{1}0.{2}'.format(request.session.uid, new Date().getTime(), images.type.split('/')[1]);
      var address = config.pictureFolderPath + name;
      fs.rename(images.path, address, function () {
        var pool = require('../models/pool.js');
        var sql = 'insert into message (`uid`,`text`,`image_url`, `video_url`,`thumb_video_url`, `music_url`, `come_from`) values("{0}","{1}","{2}","{3}","{4}", "{5}", "{6}")'.format(request.session.uid, encodeURIComponent(request.body.text), '/' + name, '', '', '', 'WeiBo');
        pool.query({sql: sql, response: response});
      });
    }
  }
  else if(musics.size) {
    var address = '{0}{1}_{2}_{3}'.format(config.musicFolderPath, request.session.uid, new Date().getTime(), images.name);
    fs.rename(images.path, address);
  }
  else if(videos.size) {
    var address = '{0}{1}_{2}_{3}'.format(config.videoFolderPath, request.session.uid, new Date().getTime(), images.name);
    fs.rename(images.path, address);
  }
};

exports.getUserMessage = function (request, response, next) {
  if(request.query.type) {
    switch (request.query.type) {
      case "all":
        var sql = 'select user.name, user.head_img, message.* from message inner join user where user.uid = message.uid';
      break;
      case "my":
        var sql = 'select user.name, user.head_img, message.* from message join user where user.uid = message.uid and message.uid = {0}'.format(request.session.uid);
      break;
      case "myCare":
        var sql = 'select user.name, user.head_img, message.* from message join user where user.uid = message.uid and message.other_message_id = {0}'.format(request.session.uid);
      break;
      default:
        var sql = 'select user.name, user.head_img, message.* from message join user where user.uid = message.uid';
      break;
    };
  }
  else {
    var sql = 'select user.name, user.head_img, message.* from message join user where user.uid = message.uid';
  }
  pool.query({
    sql: sql,
    success: function (res) {
      if(res.length) {
        response.json({has_data: true, data: res});
      }
      else {
        response.json({has_data: false});
      }
    }
  });
};

exports.addGood = function (request, response, next) {

};

exports.addComment = function (request, response, next) {

};

exports.getComment = function (request, response, next) {

};
