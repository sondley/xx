"use strict";


module.exports = StreamStorage;


let fs = require('fs');
let uuid = require('node-uuid');
let mime = require('mime');
let gm = require('gm').subClass({ imageMagick: true });
let DiskStorage = require('./disk_storage.js');


////////////////////////////////////////////////////////////


StreamStorage.prototype._handleFile = handleFile;
StreamStorage.prototype.createThumbnailStream = createThumbnailStream;
StreamStorage.prototype._removeFile = DiskStorage.removeFile;


////////////////////////////////////////////////////////////


/**
 * This function handles the stream storage
 * @param {Object} objConfig Multer Config
 * @param {Object} Storage   Storage instance
 */
function StreamStorage(objConfig, Storage=DiskStorage) {
  if (Storage.removeFile) {
    this._removeFile = Storage.removeFile;
  }

  this.config = objConfig;
  this.getDestination = (Storage.getDestination || getDestination);
  this.getThumbnailDestination = (Storage.getThumbnailDestination || getThumbnailDestination);
  this.getFilename = (Storage.getFilename || getFilename);
  this.fnWriteStreamHandler = Storage.fnWriteStream;
  this.fnReadStreamHandler = Storage.fnReadStream;
}


/**
 * This function retrieve the upload destination.
 * @param  {Object}   req         Request object.
 * @param  {Object}   objFile File name object.
 */
function getDestination(req, objFile) {
  return new Promise((resolve, reject) => {
    return this.config.path ? resolve(this.config.path) : reject();
  });
}


/**
 * This function retrieve the thumbnail upload destination.
 * @param  {String}   strDestinationPath         Destination path.
 * @param  {String}   strFileName         File name.
 * @param  {Object}   objFile File name object.
 */
function getThumbnailDestination(strDestinationPath, strFileName, objFile) {
  return new Promise((resolve, reject) => {
    return strDestinationPath ? resolve(`${strDestinationPath}/thumbnails`) : reject();
  });
}


/**
 * This function retrieve the current file name.
 * @param  {Object}   req         Request object.
 * @param  {Object}   objFile File name object.
 */
function getFilename(req, objFile) {
  return new Promise((resolve, reject) => {
    return objFile.mimetype ? resolve(`${uuid.v1()}.${mime.extension(objFile.mimetype)}`) : reject();
  });
}


/**
 * This function handles the stream file
 * @param  {Object}   req      Request Object
 * @param  {Object}   objFile  File Stream
 * @param  {Function} callback Multer Callback
 */
function handleFile(req, objFile, callback) {
  Promise.all([
    this.getDestination(req, objFile),
    this.getFilename(req, objFile)
  ]).then((listResults) => {
    let [strPath, strName] = listResults;

    return this.fnWriteStreamHandler(strPath, strName, objFile).then((objResult) => {

      return this.fnReadStreamHandler(strPath, strName).then((objReadStream) => {

        return this.createThumbnailStream(strPath, strName, { stream: objReadStream }).then(() => {
          let objResponse = Object.assign({
            path: `${strPath}/${strName}`,
            filename: strName,
          }, objResult);

          callback(null, objResponse);
        });

      });

    }).catch(callback);
  })
}


/**
 * This function create the media thumbnail
 * @param  {String} strPath Thumbnail path
 * @param  {String} strName Media filename
 * @param  {Object} objFile Stream File
 * @return {Promise}         Status of the operation.
 */
function createThumbnailStream(strPath, strName, objFile) {
  return new Promise((resolve, reject) => {
    gm(objFile.stream)
      .resize(this.config.thumbnail.width, this.config.thumbnail.height + "^>")
      .gravity('Center')
      .quality(this.config.thumbnail.quality)
      .stream((objError, stdout, stderr) => {
        return this.getThumbnailDestination(strPath, strName, objFile).then((strThumbnailPath) => {
          this.fnWriteStreamHandler(strThumbnailPath, strName, { stream: stdout }).then(resolve).catch(reject);
        });
      });
  });
}
