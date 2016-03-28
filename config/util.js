var fs = require('fs');
var path = require('path');

var mkdir = exports.mkdir = function(dirpath, callback) {
  fs.exists(dirpath, function(exists) {
    if(exists) {
      if(callback) {
        callback(dirpath);
      }
    }
    else {
      //尝试创建父目录，然后再创建当前目录
      mkdir(path.dirname(dirpath), function(){
        fs.mkdir(dirpath, callback);
      });
    }
  });
};
