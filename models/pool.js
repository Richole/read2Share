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
        }
        successHandler(results);
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
        }
        successHandler(results);
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