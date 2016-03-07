var httpRequest = require('./httpRequest.js');
httpRequest.get('www.baidu.com', '', {}, function (res) {
  console.log(res);
  var data = '';
  res.setEncoding('utf8');
  res.on('data', function (str) {
    data += str;
  })
  res.on('end', function () {
    console.log(data);
  });
}, function (e) {
  console.log(e.message);
});