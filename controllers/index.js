exports.showIndex = function (request, response, next) {
  if(request.session.account) {
    response.render('index');
  }
  else {
    response.redirect('/login');
  }
};