define(function (require, exports, module) {
  //获取cookie
  function getCookie (cookieName) {
    var cookieValue = document.cookie;
    var cookieStartAt = cookieValue.indexOf(""+cookieName+"=");
    if(cookieStartAt==-1) {
      cookieStartAt = cookieValue.indexOf(cookieName+"=");
    }
    if(cookieStartAt==-1) {
      cookieValue = null;
    }
    else {
      cookieStartAt = cookieValue.indexOf("=",cookieStartAt)+1;
      cookieEndAt = cookieValue.indexOf(";",cookieStartAt);
      if(cookieEndAt==-1)
      {
        cookieEndAt = cookieValue.length;
      }
      cookieValue = unescape(cookieValue.substring(cookieStartAt,cookieEndAt));//解码latin-1
    }
    return cookieValue;
  }
  //设置cookie
  function setCookie (cookieName, cookieValue, cookieExpires, cookiePath) {
    cookieValue = escape(cookieValue);//编码latin-1
    if(cookieExpires=="") {
      var nowDate = new Date();
      nowDate.setMonth(nowDate.getMonth()+6);
      cookieExpires = nowDate.toGMTString();
    }
    if(cookiePath!="") {
      cookiePath = ";Path="+cookiePath;
    }
    document.cookie= cookieName+"="+cookieValue+";expires="+cookieExpires+cookiePath;
  }

  function deleteCookie (cookieName) {
    var nowDate = new Date();
    nowDate.setMonth(nowDate.getMonth()-2);
    var cookieExpires = nowDate.toGMTString();
    setCookie(cookieName, "", cookieExpires, "");
  }

  exports.getCookie = getCookie;
  exports.setCookie = setCookie;
  exports.deleteCookie = deleteCookie;
});