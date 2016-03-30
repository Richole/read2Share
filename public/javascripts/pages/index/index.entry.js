define(function (require, exports, module) {
  var footer_bar = require('wb_footer_bar.js');
  var wb_news = require('wb_news.js');
  wb_news.getNews('/index/userMessage','fall-wrap');
  footer_bar.init();
});
