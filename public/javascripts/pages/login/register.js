define(function (require, exports, module) {
  var validation = require("../../commons/register_validation.js");
  function register () {
    var keyType = {};
    var self = this;
    
    this.init = function (login) {
      this.bindEvent();
      this.login = login;
    };

    this.bindEvent = function () {
      $('#rts-register').click(this.registerEvent);
      $('.rts-loginAction a').click(this.changeLoginEvent);
      $('#rts-registerform input').keyup(this.checkInputEvent);
    };

    this.changeLoginEvent = function () {
      $("#login-reset").click();
      if(self.login) {
        self.login.judgeRemember();
      }
      $('#rts-registerform .glyphicon:last-child').attr('class', 'glyphicon');
      $('.rts-register-container').fadeOut(300, function () {
        $('.rts-login-container').fadeIn(300);
      });
    };

    this.checkInputEvent = function () {
      var $icon = $(this).siblings('[data-toggle]');
      $icon.attr('class', 'glyphicon');
      var name = $(this).attr('name');
      var value = this.value;
      if(keyType[name]) {
        clearTimeout(keyType[name]);
      }
      keyType[name] = setTimeout(function () {
        switch(name) {
          case "user":
            validation.checkName(value, $icon);
            break;
          case "phone":
            validation.checkPhone(value, $icon);
            break;
          case "email":
            validation.checkEmail(value, $icon);
            break;
          case "password":
            validation.checkPassword(value, $icon);
            break;
          case "passwordRepeat":
            validation.checkPasswordRepeat($('#rts-registerform input[name=password]').val(), value, $icon);
            break;
        }
      }, 1500);
    };

    this.registerEvent = function () {
      var arr = $("#rts-registerform").serializeArray();
      var data = {};
      for(var i in arr) {
        data[arr[i].name] = arr[i].value;
      }
      $.post('/login/signUp', data, function (res) {
        if(res.isSignUp) {
          alert(res.message);
          self.changeLoginEvent();
        }
        else {
          alert(res.message)
        }
      });
    };
  }
  
  module.exports = new register();
});