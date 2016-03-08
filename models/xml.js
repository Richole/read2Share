var xml2js = require('xml2js');

var builder = new xml2js.Builder();
var parser = new xml2js.Parser();

/*
var parseString = require('xml2js').parseString;
var xml = "<root>Hello xml2js!</root>"
parseString(xml, function (err, result) {
  console.dir(result);
});
*/

exports.parseJSON = parser.parseString;
exports.build = builder.buildObject;