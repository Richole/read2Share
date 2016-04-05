var request = require('request');
var config = require('../config.js');
var pool = require('../models/pool.js');

exports.showInfo = function (request, response, next)  {
  if(request.session.uid) {
    response.render(
      'info',
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