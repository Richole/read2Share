define(function (require, exports, module) {
  var register = require("./register.js");
  var login = require("./login");
  var renderEvent = require("./renderEvent.js");
  renderEvent.render(login, register);
  login.init();
  register.init(login);
});