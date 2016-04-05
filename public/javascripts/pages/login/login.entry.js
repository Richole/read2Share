define(function (require, exports, module) {
  var register = require("register.js");
  var login = require("login");
  var renderEvent = require("renderEvent.js");
  var find = require("find.js");
  renderEvent.render(login, register);
  login.init();
  register.init(login);
});