var path=window.location.pathname;
var id=path.split('/');
$.get('/book_details/book/' + id[2] ,{
  
},function(res){
  $('.detials-body-left img').attr('src',res.data[0].book_img_url);
  $('.book-title').text(res.data[0].book_name);
  $('.book-author').text(res.data[0].book_author);
  $('.share-num').text(res.data[0].share_num);
  $('.publishing').text(res.data[0].publishing);
  $('.publishing-time').text(res.data[0].publish_time);
  $('.foregin-name').text(res.data[0].foreign_book_name);
  $('.book-type').text(res.data[0].book_type);
  $('.page-num').text(res.data[0].page_num);
  $('.book-language').text(res.data[0].book_language);
  $('.author-profile').text(res.data[0].author_profile);
  $('.catalogue').text(res.data[0].catalogue);
  $('.introduction').text(res.data[0].introduction);
  $('.abstract').text(res.data[0].abstract);
});