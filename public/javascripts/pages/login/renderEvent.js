define(function (request, exports, module) {
  function getQueryString (name) { 
    var reg = new RegExp("(^|&)" + name + "=([^&]*)", "i"); 
    var r = window.location.search.substr(1).match(reg); 
    if (r != null){
      return r[2];
    }
    return null; 
  }

  function changeVerifyEvent () {
    $('.page-container > div').hide();
    $('.rts-verify-container').show();
    if(getQueryString('verify') == 'true') {
      $('.verify-box').fadeIn(300);
    }
    else {
      $('.unverify-box').fadeIn(300);
    }
  }

  function changeFindEvent() {
    $('.page-container > div').fadeOut(300, function () {
      $('.rts-find-container').fadeIn(300);
    });
  }

  var verify = getQueryString('verify');
  var type = getQueryString('type');

  exports.render = function (login, register) {
    $('.login-animition').addClass('animition-start');
    switch(type) {
      case "verify":
        changeVerifyEvent();
      break;
      case "signUp":
        login.changeRegisterEvent();
      break;
      case "find":
      break;
      default:
        register.changeLoginEvent();
      break;
    }
  };
});