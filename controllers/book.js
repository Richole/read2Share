var request = require('request');
var config = require('../config.js');
var pool = require('../models/pool.js');

exports.showCenter = function (request, response, next) {
  response.render('book_center');
};

exports.book_details = function (request, response, next) {
  if(request.session.uid) {
    response.render(
      'book_details',
      {
      }
    );
  }
  else {
    response.redirect('/login');
  }
};