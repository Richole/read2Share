var request = require('request');
var config = require('../config.js');
var pool = require('../models/pool.js');
var fs = require('fs');

exports.check = function (request, response, next) {
  if(!request.session.uid) {
    response.redirect('/login');
  }
  else {
    next();
  }
};
