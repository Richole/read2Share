var request = require('request');
var config = require('../config.js');
var pool = require('../models/pool.js');
var fs = require("fs");

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
        var sql = 'select user.name, user.head_img, message.* from message inner join user where user.uid = message.uid order by created_at desc ,message_id desc limit 10';
      break;
      case "my":
        var sql = 'select user.name, user.head_img, message.* from message join user where user.uid = message.uid and message.uid = {0} order by created_at desc ,message_id desc limit 10'.format(request.session.uid);
      break;
      case "myCare":
        var sql = 'select user.name, user.head_img, message.* from message join user where user.uid = message.uid and message.other_message_id = {0} order by created_at desc ,message_id desc limit 10'.format(request.session.uid);
      break;
      default:
        var sql = 'select user.name, user.head_img, message.* from message join user where user.uid = message.uid order by created_at desc ,message_id desc limit 10';
      break;
    };
  }
  else {
    var sql = 'select user.name, user.head_img, message.* from message join user where user.uid = message.uid order by created_at desc ,message_id desc limit 10';
  }
  pool.query({
    sql: sql,
    success: function (res) {
      if(res.length) {
        var retransmission_ids = [];
        res.map(function (item, index) {
          if(item.other_message_id) {
            retransmission_ids.push(item.other_message_id);
          }
        });
        if(retransmission_ids.length) {
          pool.query({
            sql: 'select user.name, user.head_img, message.* from message join user where user.uid = message.uid and message.message_id IN({0})'.format(retransmission_ids.join(',')),
            success: function (data) {
              response.json({has_data: true, data: res, retransmission: data});
            }
          });
        }
        else {
          response.json({has_data: true, data: res});
        }
      }
      else {
        response.json({has_data: false, data: []});
      }
    }
  });
};

exports.addGood = function (request, response, next) {
  if(request.body.message_id) {
    pool.query({
      sql: 'select * from good where message_id = "{0}" and uid = "{1}"'.format(request.body.message_id, request.session.uid),
      success: function (res) {
        if(!res.length) {
          pool.query({
            sql: 'update message set good=good+1 where message_id = ' + request.body.message_id,
            success: function (res) {
              if(res) {
                pool.query({sql: 'insert into good (`message_id`,`uid`) values("{0}","{1}");'.format(request.body.message_id, request.session.uid)})
                response.json({success: true});
              }
            }
          });
        }
        else {
          response.json({success: false, message: "你已经赞过了！"});
        }
      }
    });
  }
  else {
    response.json({success: false, message: 'need message_id and uid!'});
  }
};

exports.retransmission = function (request, response, next) {
  if(request.body.message_id && request.body.uid) {
    if(request.body.uid == request.session.uid) {
      response.json({success: false, message: '不能转发自己的微博!'});
    }
    else {
      pool.query({
        sql: 'insert into message (`uid`, `other_message_id`, `text`, `image_url`, `video_url`, `thumb_video_url`, `music_url`, `come_from`) values("{0}","{1}","{2}","{3}","{4}", "{5}", "{6}", "{7}")'.format(request.session.uid, request.body.message_id, '', '', '', '', '', 'WeiBo'),
        success: function (res) {
          if(res) {
            pool.query({sql: 'update message set retransmission_nums=retransmission_nums+1 where message_id = ' + request.body.message_id,})
            response.json({success: true});
          }
        },
        error: function (err) {
          response.json({success: false, message: "你已经转发过了！"});
        }
      });
    }
  }
  else {
    response.json({success: false, message: 'need message_id and uid!'});
  }
};

exports.addComment = function (request, response, next) {

};

exports.getComment = function (request, response, next) {

};
