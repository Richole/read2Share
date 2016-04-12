$('.header-search-icon').click(function(){
  var searchValue = $('.header-search').val();
  location.href = "/book_center/search/" + searchValue;
});
$('.header-search').keyup(function(){
  if(event.keyCode == 13) {
    var searchValue = $('.header-search').val();
    location.href = "/book_center/search/" + searchValue;
  }
});