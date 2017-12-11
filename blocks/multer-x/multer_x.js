"use strict";


module.exports = Multer;
module.exports.MulterXMiddleware = MulterXMiddleware;


let multer  = require('multer');
let fs = require('fs');
let uuid = require('node-uuid');
let mime = require('mime');
let lodash = require('lodash');
let gm = require('gm').subClass({ imageMagick: true });
let async = require('async');
let Storage = require('./storage.js');


////////////////////////////////////////////////////////////


/**
 * Multer - Images/Media upload handler.
 * @param {Object} objConfig     Multer config.
 */
function Multer(objMulterXStream, objConfig) {
  let self = this;
  let objLocalStream = Object.assign({
    fileFilter: _fileFilter,
    path: objConfig.path,
  }, objMulterXStream);


  self.scope = {
    config: objConfig,
    mimeTypes: objConfig.allowedMimeTypes,
    storage: new Storage(objConfig, objLocalStream),
    removeFiles: objLocalStream.removeFiles
  };


  self.scope.uploader = multer({
    storage: self.scope.storage,
    limits: { fileSize: objConfig.limits },
    fileFilter: objLocalStream.fileFilter
  });


  ////////////////////////////////////////////////////////////


  /**
   * This function filter the upload files.
   * @param  {Object}   req         Request object.
   * @param  {Object}   objFile File name object.
   * @param  {Function} callback    Callback function.
   */
  function _fileFilter(req, objFile, callback) {
    if (self.scope.mimeTypes.includes(objFile.mimetype)) {
      callback(null, true);
    }
    else {
      callback('Unsupported media format!');
    };
  }
}


/**
 * This function create the MulterX middleware
 * @param {Object} objMulterX MulterX Config instance
 * @param {Array}  listFields List of uploader fields
 */
function MulterXMiddleware(objMulterX={}, listFields=[]) {


  ////////////////////////////////////////////////////////////


  /**
   * This function handles the images middleware.
   * @param  {Object}   req  Request Object
   * @param  {Object}   res  Response Object
   * @param  {Function} next Next callback
   */
  function middleware(req, res, next) {
    objMulterX.scope.uploader.fields(listFields)(req, res, (objError) => {
      if (objError) {
        res.locals.hasError = true;
        res.locals.error = objError;
        next();
        return objMulterX.scope.removeFiles(req.files);
      }
      else {
        req.body = Object.assign(req.body, parseFiles(req.files));
        next();
      }
    });
  }


  return middleware;
}


/**
 * This function parse the uploaded files
 * @param  {Object} objFiles Files object
 * @return {Object}            Parsed files
 */
function parseFiles(objFiles={}) {
  let objParsedFiles = {};


  Object.keys(objFiles).forEach((strKey) => {
    let listFiles = objFiles[strKey];
    objParsedFiles[strKey] = listFiles.map((objFile) => {
      return {
        fileName: objFile.filename,
        mediaType: objFile.mimetype
      }
    });
  });


  return objParsedFiles;
}
