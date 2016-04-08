var model = $('.book-model');
var model1 = $('.book2-model');

$.get('/test.json', {type: $(this).attr('data-type')}, function (res) {
  $('.books-show').empty();
  for(var i = 0; i < res.data.length; i++) {
    var cloneObj = model.clone();
    cloneObj.removeClass('book-model');
    cloneObj.find('img').attr('src', res.data[i].url);
    cloneObj.find('a').text(res.data[i].book_name);
    cloneObj.find('.book-author').text(res.data[i].book_author);
    $('.books-show').append(cloneObj);
  }
});

$.get('/test.json', {type: '热搜推荐'}, function (res) {
  $('.books-search-more > div').remove();
  for(var i = 0; i < res.data.length; i++) {
    var cloneObj = model1.clone();
    cloneObj.removeClass('book2-model');
    cloneObj.find('img').attr('src', res.data[i].url);
    cloneObj.find('a').text(res.data[i].book_name);
    cloneObj.find('.book-author').text(res.data[i].book_author);
    $('.books-search-more').append(cloneObj);
  }
});

$.get('/test.json', {type: '人气推荐'}, function (res) {
  $('.books-hot > div').remove();
  for(var i = 0; i < res.data.length; i++) {
    var cloneObj = model1.clone();
    cloneObj.removeClass('book2-model');
    cloneObj.find('img').attr('src', res.data[i].url);
    cloneObj.find('a').text(res.data[i].book_name);
    cloneObj.find('.book-author').text(res.data[i].book_author);
    $('.books-hot').append(cloneObj);
  }
});


$(".book-list li a").click(function(){
  var type = $(this).text();
  $.get('/test.json',{
     datatype: type
    },function(res){
    $('.books-show').empty();
    $('.books-search-more').remove();
    $('.books-hot').remove();
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
      cloneObj.find('img').attr('src',item.url);
      cloneObj.find('.book-name').text(item.book_name);
      cloneObj.find('.book-author').text(item.book_author);
      $('.books-show').append(cloneObj);
    });
  });
});
