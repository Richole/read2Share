var model = $('.book-model');
var model1 = $('.book2-model');

$.get('/book_center/bookNews', {type: $(this).attr('data-type')}, function (res) {
  //$('.books-show').empty();
  for(var i = 0; i < res.data.length; i++) {
    var cloneObj = model.clone();
    cloneObj.removeClass('book-model');
    cloneObj.find('img').attr('src', res.data[i].book_img_url);
    cloneObj.find('.book-name').text(res.data[i].book_name);
    cloneObj.find('.book-author').text(res.data[i].book_author);
    cloneObj.find('.book-name').attr('href','/book_details/' + res.data[i].book_id);
    cloneObj.find('.book-img-a').attr('href','/book_details/' + res.data[i].book_id);
    $('.books-show').append(cloneObj);
  }
});

$.get('/book_center/bookSearch', function (res) {
  $('.books-search-more > div').remove();
  for(var i = 0; i < res.data.length; i++) {
    var cloneObj = model1.clone();
    cloneObj.removeClass('book2-model');
    cloneObj.find('img').attr('src', res.data[i].book_img_url);
    cloneObj.find('.book-name').text(res.data[i].book_name);
    cloneObj.find('.book-author').text(res.data[i].book_author);
    cloneObj.find('.book-name').attr('href','/book_details/' + res.data[i].book_id);
    cloneObj.find('.book-img-a').attr('href','/book_details/' + res.data[i].book_id);
    $('.books-search-more').append(cloneObj);
  }
});

$.get('/book_center/bookHot', function (res) {
  $('.books-hot > div').remove();
  for(var i = 0; i < res.data.length; i++) {
    var cloneObj = model1.clone();
    cloneObj.removeClass('book2-model');
    cloneObj.find('img').attr('src', res.data[i].book_img_url);
    cloneObj.find('.book-name').text(res.data[i].book_name);
    cloneObj.find('.book-author').text(res.data[i].book_author);
    cloneObj.find('.book-name').attr('href','/book_details/' + res.data[i].book_id);
    cloneObj.find('.book-img-a').attr('href','/book_details/' + res.data[i].book_id);
    $('.books-hot').append(cloneObj);
  }
});


$(".book-list li a").click(function(){
  var type = $(this).text();
  $.get('/book_center/bookTypeDetails',{
     book_type: type
    },function(res){
    $('.books-show > div').remove();
    $('.books-search-more').remove();
    $('.books-hot').remove();
    $('.book-title').text(type);
    // for(var i = 0 ; i < res.data.length; i++){
    //   var cloneObj = $('.book-model').clone();
    //   cloneObj.removeClass('book-model');
    //   cloneObj.find('img').attr('src',res.data[i].url);
    //   cloneObj.find('a').text(res.data[i].book_name);
    //   cloneObj.find('.book-description').text(res.data[i].book_author);
    //   $('.books-show').append(cloneObj);
    // }
    res.data.map(function (item, index) {
      var cloneObj = $('.book-model').clone();
      cloneObj.removeClass('book-model');
      cloneObj.find('img').attr('src',item.book_img_url);
      cloneObj.find('.book-name').text(item.book_name);
      cloneObj.find('.book-author').text(item.book_author);
      cloneObj.find('.book-name').attr('href','/book_details/' + item.book_id);
      cloneObj.find('.book-img-a').attr('href','/book_details/' + item.book_id);
      $('.books-show').append(cloneObj);
    });
  });
});
var path= window.location.pathname;
var x= path.split('/');
if(x[2]==""){

}
else{
  $.get('/book_center/bookSearch',{
    searchText: x[2]
  },function(res){
    console.log(res);
  });
}