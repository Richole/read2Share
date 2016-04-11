var request = require('request');
var config = require('../config.js');
var pool = require('../models/pool.js');

exports.showCenter = function (request, response, next) {
  if(request.session.uid) {
    response.render( 'book_center', {
      name: request.session.name,
      head_img: request.session.head_img
    });
  }
  else {
    response.redirect('/login');
  }
};

exports.book_details = function (request, response, next) {
  if(request.session.uid) {
    response.render( 'book_details', {
      name: request.session.name,
      head_img: request.session.head_img
    });
  }
  else {
    response.redirect('/login');
  }
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
    sql: 'select book_id, book_name, book_img_url, book_author from book order by created_at desc limit 9;',
    success: function (res) {
      response.json({data: res});
    }
  });
};

exports.bookHot = function (request, response, next) {
  pool.query({
    sql: 'select book_id, book_name, book_img_url, book_author from book order by share_num desc limit 12;',
    success: function (res) {
      response.json({data: res});
    }
  });
};

exports.bookSearch = function (request, response, next) {
  pool.query({
    sql: 'select book_id, book_name, book_img_url, book_author from book order by search_num desc limit 12;',
    success: function (res) {
      response.json({data: res});
    }
  });
};

exports.bookTopList = function (request, response, next) {
};
