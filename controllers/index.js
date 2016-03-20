var request = require('request');
var config = require('../config.js');
var pool = require('../models/pool.js');
var fs = require("fs");
config.pictureFolderPath = "/home/richole/Pictures/";

exports.showIndex = function (request, response, next) {
  if(request.session.uid) {
    response.render('index', {name: request.session.name});
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
  request.body.text = request.body.text | "";
  
  if(!isArray && !musics.size && !videos.size && request.body.text) {
    var sql = 'insert into message (`uid`,`text`,`image_url`, `video_url`,`thumb_video_url`, `music_url`, `come_from`) values("{0}","{1}","{2}","{3}","{4}", "{5}", "{6}")'.format(request.session.uid, encodeURIComponent(request.body.text), '', '', '', '', 'WeiBo');
    pool.query({sql: sql});
  }
  if(isArray) {
    var arr = [];
    for(var i in images) {
      var name = '{0}.{1}'.format(i, images[1].type.split('/')[1]);
      var address = '{0}{1}_{2}_{3}'.format(config.pictureFolderPath, request.session.uid, new Date().getTime(), name);
      arr.push(address);
      fs.rename(images[i].path, address);
    }
    var sql = 'insert into message (`uid`,`text`,`image_url`, `video_url`,`thumb_video_url`, `music_url`, `come_from`) values("{0}","{1}","{2}","{3}","{4}", "{5}", "{6}")'.format(request.session.uid, encodeURIComponent(request.body.text), arr.join('###'), '', '', '', 'WeiBo');
    pool.query({sql: sql});
  }
  else {
    if(images.size) {
      var name = '0.{0}'.format(images.type.split('/')[1]);
      var address = '{0}{1}_{2}_{3}'.format(config.pictureFolderPath, request.session.uid, new Date().getTime(), name);
      fs.rename(images.path, address, function () {
        var pool = require('../models/pool.js');
        var sql = 'insert into message (`uid`,`text`,`image_url`, `video_url`,`thumb_video_url`, `music_url`, `come_from`) values("{0}","{1}","{2}","{3}","{4}", "{5}", "{6}")'.format(request.session.uid, encodeURIComponent(request.body.text), address, '', '', '', 'WeiBo');
        pool.query({sql: sql});
      });
    }
  }
  if(musics.size) {
    var address = '{0}{1}_{2}_{3}'.format(config.musicFolderPath, request.session.uid, new Date().getTime(), images.name);
    fs.rename(images.path, address);
  }
  if(videos.size) {
    var address = '{0}{1}_{2}_{3}'.format(config.videoFolderPath, request.session.uid, new Date().getTime(), images.name);
    fs.rename(images.path, address);
  }
  response.json({sussess: true});
};

exports.getUserMessage = function (request, response, next) {
  if(request.query.type) {
    switch (request.query.type) {
      case "all":
        var sql = 'select * , DATE_FORMAT(created_at, "%Y-%m-%d %T") as format_time from message';
      break;
      case "my":
        var sql = 'select * , DATE_FORMAT(created_at, "%Y-%m-%d %T") as format_time from message where `uid` = {0}'.format(request.session.uid);
      break;
      case "myCare":
        var sql = 'select * , DATE_FORMAT(created_at, "%Y-%m-%d %T") as format_time from message where `other_message_id` = {0}'.format(request.session.uid);
      break;
      default:
        var sql = 'select * , DATE_FORMAT(created_at, "%Y-%m-%d %T") as format_time from message';
      break;
    };
  }
  else {
    var sql = 'select * , DATE_FORMAT(created_at, "%Y-%m-%d %T") as format_time from message';
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