var request = require('request');
var config = require('../config.js');
var fs = require("fs");
config.pictureFolderPath = "/home/richole/Pictures/";

exports.showIndex = function (request, response, next) {
  if(request.session.uid) {
    response.render('index');
  }
  else {
    response.redirect('/login');
  }
};

exports.userMessage = function (request, response, next) {
  function saveFile (oldAddress, newAddress) {
    fs.renameSync(oldAddress, newAddress);
  }
  var images = request.files.images;
  var musics = request.files.musics;
  var videos = request.files.videos;
  var isArray = request.files.images.length != undefined;
  if(isArray) {
    for(var i in images) {
      var address = '{0}{1}_{2}_{3}'.format(config.pictureFolderPath, request.session.uid, new Date().getTime(), images[i].name);
      saveFile(images[i].path, address);
    }
  }
  else {
    if(images.size) {
      var address = '{0}{1}_{2}_{3}'.format(config.pictureFolderPath, request.session.uid, new Date().getTime(), images.name);
      saveFile(images.path, address);
    }
  }
  if(musics.size) {
    var address = '{0}{1}_{2}_{3}'.format(config.musicFolderPath, request.session.uid, new Date().getTime(), images.name);
    saveFile(images.path, address);
  }
  if(videos.size) {
    var address = '{0}{1}_{2}_{3}'.format(config.videoFolderPath, request.session.uid, new Date().getTime(), images.name);
    saveFile(images.path, address);
  }
  response.json({sussess: true});
}