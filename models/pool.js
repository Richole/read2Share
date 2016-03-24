var config = require("../config");

var options = {
  'host': config.host,
  'user': config.user,
  'password': config.password,
  'database': config.database
};

var mysql = require('mysql');
var pool = mysql.createPool(options);

/**
 * 释放数据库连接
 */
exports.release = function(connection) {
  connection.end(function(error) {
    console.log('Connection closed');
  });
};


exports.query = function(options) {
  pool.getConnection(function(error, connection) {
    if(error) {
      console.log('DB-获取数据库连接异常！');
      throw error;
    }

    var sql = options['sql'];
    var args = options['args'];
    var successHandler = options['success'];
    var errorHandler = options['error'];
    var response = options['response'];
    console.log(sql);
    if(!args) {
      var query = connection.query(sql, function(error, results) {
        if(error) {
          if(errorHandler) {
            errorHandler(error);
          }
          else {
            console.log(error.stack);
          }
          if(response) {
            response.json({success: false});
          }
        }
        else{
          if(successHandler) {
            successHandler(results);
          }
          if(response) {
            response.json({success: true});
          }
        }
      });
    }
    else {
      var query = connection.query(sql, args, function(error, results) {
        if(error) {
          if(errorHandler) {
            errorHandler(error);
          }
          else {
            console.log(error.stack);
          }
          if(response) {
            response.json({success: false});
          }
        }
        else{
          if(successHandler) {
            successHandler(results);
          }
          if(response) {
            response.json({success: true});
          }
        }
      });
    }

    connection.release(function(error) {
      if(error) {
        console.log('DB-关闭数据库连接异常！');
        throw error;
      }
    });
  });
};
