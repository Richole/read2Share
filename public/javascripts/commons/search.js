var search = document.getElementsByClassName('header-search')[0];
var searchIcon = document.getElementsByClassName('header-search-icon')[0];
searchIcon.onclick = function () {
  var searchValue = search.value;
  location.href = "/book_center/search/" + searchValue;
};

search.onkeyup = function () {
  if(event.keyCode == 13) {
    var searchValue = this.value;
    location.href = "/book_center/search/" + searchValue;
  }
};