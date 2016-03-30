define(function (require, exports, module) {
  var cookie = require("../../commons/cookie.js");

  function login () {
    var self = this;
    var hasCookie = false;

    this.init = function () {
      this.judgeRemember();
      this.eventInit();
    };


    this.judgeRemember = function () {
      var account = cookie.getCookie('account');
      var password = cookie.getCookie('password');
      if(account && password) {
        hasCookie = true;
        $(".rts-login-container [name=account]").val(account);
        $(".rts-login-container [name=password]").val(password);
        $(".rts-login-container [name=remember]").get(0).checked = true;
      }
    };

    this.eventInit = function () {
      $('.rts-create a').click(this.changeRegisterEvent);
      $('#rtx-loginBtn').click(this.loginEvent);
      $("[name=remember]").click(this.cancelRememberEvent);
      $(".rts-account input, .rts-password input").focus(this.deleteCookieEvent);
      $(".rts-remember a").click(function () {
        $("[name=remember]").click();
      });
    };

    this.deleteCookieEvent = function () {
      if(hasCookie) {
        hasCookie = false;
        cookie.deleteCookie("account");
        cookie.deleteCookie("password");
        $("#login-reset").click();
      }
    };

    this.cancelRememberEvent = function () {
      if(this.checked == false) {
        cookie.deleteCookie("account");
        cookie.deleteCookie("password");
        $("#login-reset").click();
      }
    };

    this.changeRegisterEvent = function () {
      $("#register-reset").click();
      $('.rts-login-container').fadeOut(300, function () {
        $('.rts-register-container').fadeIn(300);
      });
    };

    this.loginEvent = function () {
      var arr = $("#rts-loginForm").serializeArray();
      var data = {};
      for(var i in arr) {
        data[arr[i].name] = arr[i].value;
      }

      $.post('/login/signIn', data, function (res) {
        if(res.isVerify) {
          window.location.href = "/";
        }
        else {
          alert(res.message)
        }
      });
    };
  }

  module.exports = new login();
});
