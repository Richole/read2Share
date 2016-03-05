// 清空webpack_bundle
var fs = require('fs');
function clearDir(str) {
  fs.readdir(str, function (err, files) {
    for(var name in files) {
      var curPath = str + '/' + files[name];
      if(fs.statSync(curPath).isDirectory()) {
        clearDir(curPath);
      }
      else {
        fs.unlink(str + '/' + files[name]);
      }
    }
  });
}
clearDir('./public/webpack_bundle');


var config = {
  entry: {
    // pc公共入口文件
    "common": "common.entry.js",
    "login": "login.entry.js",
    "index": "index.entry.js"
  },
  output: {
    path: "./public/webpack_bundle",  // 出口文件路径
    filename: "[name].bundle.js", // 出口文件名字, [name]指的是entry的key值, 如果有多个key, 则输出多个出口文件
    publicPath:"/webpack_bundle/", //给require.ensure用
    chunkFilename: "[name].chunk.js"//给require.ensure用
  },
  module: {
    loaders: [
      { test: /\.css$/, loader: "style-loader!css-loader"}, // css模块化
      { test: /\.js$/, loader: "jsx-loader?harmony"}, // js用jsx-loader来编译
      { test: /\.(scss|sass)$/, loader: "style!css!sass"}, // scss,sass文件用style-loader、css-loader 和 sass-loader 来编译处理
      { test: /\.(png|jpg)$/, loader: "url-loader?limit=8192"}, //图片模块化, 小于8k都转为base64格式
      { test:/\.(woff|svg|ttf|eot|woff2)$/,loader:'url-loader?limit=10000'}
      //ps: "-loader"其实是可以省略不写的，多个loader之间用“!”连接起来。
      //{ test: require.resolve("./src/js/tool/swipe.js"),  loader: "exports?swipe"}
      //exports-loader可以对不符合AMD/CMD规范的模块(比如一些直接返回全局变量的插件)进行shim处理.
      //{ test: require.resolve("./public/javascripts/plugins/jquery-1.11.2.min.js"),  loader: "expose?jQuery"}
    ]
  },
  resolve: {
    root: [ "/public/images",
            "/public/javascripts",
            "/public/javascripts/commons",
            "/public/javascripts/pages",
            "/public/javascripts/pages/login",
            "/public/javascripts/pages/index",
            "/public/javascripts/plugins",
            "/public/stylesheets/commons",
            "/public/stylesheets/pages",
            "/public/stylesheets/plugins",
            "/public/stylesheets/fonts",
    ],
    // root 指定require模块时默认路径,遍历root数组查找该模块
    alias: {
    }
    // alias 重命名模块名称
  },
  externals: {
    "jquery": "$"
  },
  // externals属性指 require('jquery')时,将会返回全局$变量.
};

/*
$ webpack --display-error-detaiess --color --progress #运行webpack并显示进度及颜色
$ webpack --display-error-detaiess --color --progress -p #压缩js css
*/
function formatAddress (address) {
  // 改为绝对路径
  for(var i in address) {
    address[i] =  __dirname + address[i];
  }
}


formatAddress(config.resolve.root);
module.exports = config;