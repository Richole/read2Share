define(function (require, exports, module) {
  function find () {
    this.init = function () {
      this.bindEvent();
    }

    this.bindEvent = function () {
      $(".rts-reset a").click(function(){
        $(".rts-login-container").fadeOut(200 ,function(){
          $('.rts-find-container').fadeIn(200);
        });
      });
      $('.rts-findAction a').click(function(){
        $(".rts-find-container").fadeOut(200 ,function(){
          $('.rts-login-container').fadeIn(200);
        });
      });
      $('.rts-reset-container input').click(function(){
        
        $.post('/login/findverify',{
          phone:$('.rts-find-phone input').val(),
          email:$('.rts-find-email input').val()
        }, function(res){
          alert(res.message);
          if(res.isVerify){
            $('.rts-identify-code').show();
          }
          else{

          }
          })
      });
    }
  }

  var findObj = new find();
  findObj.init();
});