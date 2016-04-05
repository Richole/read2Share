define(function (require, exports, module) {
  function find () {
    this.state = 0;

    this.init = function () {
      this.bindEvent();
    }

    this.bindEvent = function () {
      var self = this;
      $(".rts-reset a").click(function(){
        $(".rts-login-container").fadeOut(200 ,function(){
          $('#rts-find-container1').fadeIn(200);
        });
      });
      $('.rts-findAction a').click(function(){
        $('#rts-find-container2').hide();
        $("#rts-find-container1").fadeOut(200 ,function(){
          $('.rts-login-container').fadeIn(200);
        });
      });
      $('input#rts-reset').click(function(){
        if(self.state == 0) {
          $.post('/login/findverify', {
              phone:$('.rts-find-phone input').val(),
              email:$('.rts-find-email input').val()
            }, function(res) {
              alert(res.message);
              if(res.isVerify) {
                self.state = 1;
                $('.rts-identify-code').show();
                $('input#rts-reset').val('提交');
              }
            }
          );
        }
        else if(self.state == 1) {
          $.post('/login/verifyIdentityCode', {
            code:$('.rts-identify-code input').val()
         }, function(res){
            if(res.isVerify){
              $('#rts-find-container2').show();
              $('#rts-find-container1').hide();
            }
            else{
              alert(res.message);
            }
           })
        }
      });
      $('#rts-reset2').click(function () {
        if($('.rts-find-password input').val() == $('.rts-find-againPassword input').val()){
          $.post('/login/modifyPassword',{
            password: $('.rts-find-password input').val() 
          },function(res){
            if(res.isVerify){
              alert(res.message);
            }
            else{
              alert(res.message);
            }
          });
        }
        else{
          alert('前后两次密码不一致');
        }
      });
    }
  }

  var findObj = new find();
  findObj.init();
});