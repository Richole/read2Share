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
        response.json({data: res});
      }
    });
  }
  else {
    response.json({success: false});
  }
};
