"use strict";


var path = require('path');
var rootPath = path.normalize(__dirname + '/../..');
const strUploadDir = rootPath + '/public/upload/';

module.exports = {
	root: rootPath,
	uploadDir: strUploadDir,
	videosDir:  strUploadDir + 'videos/',
	port: process.env.PORTv || 3000,
  modelsDir: rootPath + '/sequelize/models'
}