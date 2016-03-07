var https = require('https');  
var http = require('http');
var querystring = require('querystring');

/*
success: function (res) {
  var data = "";
  res.on('data', function (str) {
    data += str;
  })
  res.on('end', function () {
    data = JSON.parse(data);
  })
}
*/

function isHttps(url) {
  if(url.indexOf('https://') == 0) {
    return true;
  }
  return false;
}

/*function get(url, success) {
  if(isHttps(url)) {
    https.get(url, success);
  }
  else {
    http.get(url, success);
  }
}*/

var options = {
  protocol: 'https',
  hostname: '',
  port: 80,
  path: '',
  method: '',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'Content-Length': ''
  }
};
function get(hostname, path, data, success, error) {
  data = querystring.stringify(data);
  options.hostname = hostname;
  options.path = path;
  options.method = 'GET';
  options.headers['Content-Length'] = data.length;
  if(true) {
    console.log('https');
    var req = https.request(options, success);
  }
  else {
    req = http.request(options, success);
  }
  req.on('error', error);  
  req.write(data);  
  req.end();
}
function post(hostname, path, data, success, error) {
  data = querystring.stringify(data);
  options.hostname = hostname;
  options.path = path;
  options.method = 'POST';
  options.headers['Content-Length'] = data.length;
  if(isHttps(hostname)) {
    var req = https.request(options, success);
  }
  else {
    req = http.request(options, success);
  }
  req.on('error', error);  
  req.write(data);  
  req.end();
}



exports.get = get;
exports.post = post; 