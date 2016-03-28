var program = require('commander');
var config;
program
  // .version('0.0.1')
  // .option('-p, --peppers', 'Add peppers')
  // .option('-P, --pineapple', 'Add pineapple')
  // .option('-b, --bbq', 'Add bbq sauce')
  // .option('-c, --cheese [type]', 'Add the specified type of cheese [marble]', 'marble')
  .option('-d, --development', 'use development environment')
  .option('-p, --production', 'use production environment')
  .parse(process.argv);

if (program.production) {
  config = require('./config/production.js');
  console.log('using production environment');
}
else {
  config = require('./config/development.js');
  console.log('using development environment');
}

module.exports = config;
