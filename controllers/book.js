var request = require('request');
var config = require('../config.js');
var pool = require('../models/pool.js');

exports.showCenter = function (request, response, next) {
  response.render( 'book_center', {
    name: request.session.name,
    head_img: request.session.head_img
  });
};

exports.book_details = function (request, response, next) {
  response.render( 'book_details', {
    name: request.session.name,
    head_img: request.session.head_img
  });
};

exports.book = function (request, response, next) {
  var isVerify = request.params.id == parseInt(request.params.id);
  if(request.params.id && isVerify) {
    pool.query({
      sql: 'select * from book where book_id = ' + request.params.id,
      success: function (res) {
        pool.query({sql: `update book set search_num = search_num + 1 where book_id = ${request.params.id}`});
        response.json({data: res});
      }
    });
  }
  else {
    response.json({success: false});
  }
};

exports.bookNews = function (request, response, next) {
  pool.query({
    sql: 'select book_id, book_name, book_img_url, book_author from book order by created_at desc limit 9',
    success: function (res) {
      response.json({data: res});
    }
  });
};

exports.bookHot = function (request, response, next) {
  pool.query({
    sql: 'select book_id, book_name, book_img_url, book_author from book order by share_num desc limit 12',
    success: function (res) {
      response.json({data: res});
    }
  });
};

exports.bookSearch = function (request, response, next) {
  pool.query({
    sql: 'select book_id, book_name, book_img_url, book_author from book order by search_num desc limit 12',
    success: function (res) {
      response.json({data: res});
    }
  });
};

exports.bookTypeDetails = function (request, response, next) {
  if(request.query.book_type) {
    pool.query({
      sql: `select book_id, book_name, book_img_url, book_author from book where book_type = '${request.query.book_type}'`,
      success: function (res) {
        response.json({data: res});
      }
    })
  }
  else {
    response.json({data: [], message: '缺少参数book_type'});
  }
};

exports.bookTopList = function (request, response, next) {
  if(request.session.listNum) {
    request.session.listNum = request.session.listNum <= 2 ? request.session.listNum + 1 : 1;
  }
  else {
    request.session.listNum = 1;
  }
  var start = (request.session.listNum - 1) * 7 - (request.session.listNum - 1);
  pool.query({
    sql: `select book_id, book_name, search_num from book order by search_num desc limit ${start}, 7`,
    success: function (res) {
      response.json({data: res});
    }
  });
};

exports.search = function (request, response, next) {
  if(request.query.searchText) {
    var searchText = decodeURIComponent(request.query.searchText);
    pool.query({
      sql: `select book_id, book_name, book_img_url, book_author from book where book_name like '%${searchText}%' or book_author like '%${searchText}%' or foreign_book_name like '%${searchText}%'`,
      success: function (res) {
        response.json({"data": res});
      }
    })
  }
  else {
    response.json({"success": false, "message": "缺少参数searchText"});
  }
};

exports.shareBook = function (request, response, next) {
  if(request.body.book_id && request.body.share_text) {
    pool.query({
      sql: `select book_name, book_img_url from book where book_id = ${request.body.book_id}`,
      success: function (res) {
        if(res.length) {
          var book_name = res[0].book_name;
          var book_img_url = res[0].book_img_url;
          var tag = `<a class="book-share-item" data-bookId="${request.body.book_id}">#${book_name}#</a>`;
          var text = encodeURIComponent(tag + request.body.share_text);
          pool.query({
            sql: 'insert into message (`uid`,`text`,`image_url`, `video_url`,`thumb_video_url`, `music_url`, `come_from`) values("{0}","{1}","{2}","{3}","{4}", "{5}", "{6}")'.format(request.session.uid, text, book_img_url, '', '', '', '阅读分享平台')
          });
          response.json({"success": true, "message": "分享成功"});
        }
        else {
          response.json({"success": false, "message": "没有此书"});
        }
      }
    });
  }
  else {
    response.json({"success": false, "message": "缺少参数book_id"});
  }
};
