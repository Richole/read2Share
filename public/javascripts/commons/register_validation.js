define(function (require, exports, module) {

  var message = {
    email: "邮件格式错误,请输入正确的邮箱",
    phone: "号码格式错误",
    password: "密码长度需大于6位,小于20位",
    name: "名字不能包含符号,长度在20位以内",
    passwordRepeat: "密码输入不一致"
  };

  function isEmailType (str) {
    var rude = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
    return rude.test(str);
  }

  function isPhoneType (str) {
    var rude = /^1\d{10}$/;
    return rude.test(str);
  }

  function passwordEnable (str) {
    return (str.length >= 6 && str.length <= 20) ? true : false;
  }

  function hasAbnormalWord (str) {
    var rude = /[`~%!@#^=''?~！@#￥……&——‘”“'？/*()（），,。.、]/;
    return rude.test(str);
  }

  function isNameType (str) {
    return hasAbnormalWord(str) ? false : true;
  }

  function setErrorIcon ($icon, message) {
    $icon.addClass('glyphicon-remove');
    if(message) {
      $icon.attr('title', message);
    }
  }

  function setRightIcon ($icon, message) {
    $icon.addClass('glyphicon-ok');
    if(message) {
      $icon.attr('title', message);
    }
    else {
      $icon.removeAttr('title');
    }
  }

  exports.checkName = function (name, $icon) {
    if(!isNameType(name)) {
      setErrorIcon($icon, message.name);
    }
    else{
      setRightIcon($icon);
    }
  };

  exports.checkEmail = function (email, $icon) {
    if(!isEmailType(email)) {
      setErrorIcon($icon, message.email);
    }
    else {
      $.get("/login/checkEmail", {email: email}, function (res) {
        if(res.usable) {
          setRightIcon($icon, res.message);
        }
        else {
          setErrorIcon($icon, res.message);
        }
      });
    }
  };

  exports.checkPhone = function (phone, $icon) {
    if(!isPhoneType(phone)) {
      setErrorIcon($icon, message.phone);
    }
    else {
      $.get("/login/checkPhone", {phone: phone}, function (res) {
        if(res.usable) {
          setRightIcon($icon, res.message);
        }
        else {
          setErrorIcon($icon, res.message);
        }
      });
    }
  };

  exports.checkPassword = function (password, $icon) {
    if(!passwordEnable(password)) {
      setErrorIcon($icon, message.password);
    }
    else{
      setRightIcon($icon);
    }
  };

  exports.checkPasswordRepeat = function (pre, last, $icon) {
    if(pre != last) {
      setErrorIcon($icon, message.passwordRepeat);
    }
    else{
      setRightIcon($icon);
    }
  };

});