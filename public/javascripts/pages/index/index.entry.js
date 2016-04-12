define(function (require, exports, module) {
  var footer_bar = require('wb_footer_bar.js');
  var wb_news = require('wb_news.js');
  var book_list = require('book_list.js');
  wb_news.getNews('/index/userMessage','fall-wrap');
  book_list.getList('/book_center/bookTopList', 'hot-book');
  footer_bar.init();
});
