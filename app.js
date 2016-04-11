var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var webRouter = require('./routes/webRouter');
var domain = require('domain');
var config = require('./config.js');
var ejs = require('ejs');
var log = require('./models/log');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', ejs.__express);
app.set('view engine', 'html');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: '12345',
  name: 'testapp',
  resave: true,
  saveUninitialized: true
}));
app.use(bodyParser.text({type: 'text/xml'}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(config.pictureFolderPath)));
log.use(app);
app.use(function (req, res, next) {
  console.log(`${req.method}:  ${req.path}`);
  var reqDomain = domain.create();
  reqDomain.on('error', function (err) { // 下面抛出的异常在这里被捕获
    console.log(err.stack);
    log.logger.info(err.stack);
    res.send(500, err.stack); // 成功给用户返回了 500
  });
  reqDomain.run(next);
});
app.use('/', webRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {

  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
app.use(function(err, req, res, next) {
  if(err.status == 404) {
    console.error(req.path + ' NOT FOUND.');
  }
  else {
    console.log(err);
    log.logger.info(err);
  }
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
