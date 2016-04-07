var request = require('request');
var config = require('../config.js');
var pool = require('../models/pool.js');

exports.showBackstage= function (request, response, next) {
  if(request.session.uid) {
    response.render( 'backstage');
  }
  else {
    response.redirect('/login');
  }
};
