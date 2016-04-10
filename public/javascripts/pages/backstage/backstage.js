$('#book-insert').click(function () {
  $.ajax({
    url : '/backstage/bookInfo',
    type : 'POST',
    data : new FormData($('#book-form').get(0)),
    processData : false,  //必须false才会避开jQuery对 formdata 的默认处理,XMLHttpRequest会对 formdata 进行正确的处理
    contentType : false, //必须false才会自动加上正确的Content-Type
    success : function(res) {
      console.log(res);
      if(res.success) {
        alert('提交成功。');
      }
      else {
        alert(res.message);
      }
    },
    error : function(err) {
      alert('提交失败。');
    }
  });
});
