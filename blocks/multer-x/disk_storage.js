"use strict";


module.exports = {
  fnWriteStream: diskWriteStream,
  fnReadStream: diskReadStream,
  removeFile,
  removeFiles,
  getDestination: null,
  getFilename: null
};


let fs = require('fs');


////////////////////////////////////////////////////////////


/**
 * Disk Storage Stream
 * @param  {String} strPath Media Path
 * @param  {String} strName Media Filename
 * @param  {Object} objFile File Object
 * @return {Promise}         Stream status
 */
function diskWriteStream(strPath, strName, objFile) {
  return new Promise((resolve, reject) => {
    let outStream = fs.createWriteStream(`${strPath}/${strName}`);
    objFile.stream.pipe(outStream);

    outStream.on('error', reject);

    outStream.on('finish', () => {
      resolve({ size: outStream.bytesWritten });
    });
  });
}


/**
 * Disk Read Storage Stream
 * @param  {String} strPath Media Path
 * @param  {String} strName Media Filename
 * @return {Promise}         Read Stream
 */
function diskReadStream(strPath, strName) {
  return new Promise((resolve, reject) => {
    resolve(fs.createReadStream(`${strPath}/${strName}`));
  });
}


/**
 * This function clean uploaded files.
 * @param  {Array} listFiles List of multer files
 */
function removeFiles(listFiles={}) {
  let listPromises = [];
  Object.keys(listFiles).forEach((strKey) => {
    listFiles[strKey].forEach((objFile) => {
      fs.stat(objFile.path, (objError) => {
        if (!objError) {
          listPromises.push(fs.unlink(objFile.path));
        }
      });
    });
  });


  return Promise.all(listPromises);
}


/**
 * This function remove a single uploaded file.
 * @param  {Object}   req      Request Object
 * @param  {Object}   objFile  File Stream
 * @param  {Function} callback Multer Callback
 */
 function removeFile(req, objFile, callback) {
   fs.unlink(objFile.path, callback)
 }