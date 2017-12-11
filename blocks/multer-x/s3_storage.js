"use strict";


const AWS = require('aws-sdk');


module.exports = AmazonS3Storage;


////////////////////////////////////////////////////////////


function AmazonS3Storage(objConfig) {

  const objS3 = new AWS.S3(objConfig.s3ClientOptions);

  /**
   * Disk Storage Stream
   * @param  {String} strPath Media Path
   * @param  {String} strName Media Filename
   * @param  {Object} objFile File Object
   * @return {Promise}         Stream status
   */
  function diskWriteStream(strPath, strName, objFile) {
    const objParams = {
      ACL: objConfig.ACL || 'private',
      Bucket: objConfig.bucket,
      Key: `${strPath}/${strName}`,
      Body: objFile.stream,
      ServerSideEncryption: 'AES256'
    };


    return new Promise((resolve, reject) => {
      objS3.upload(objParams, function(objError, objData) {
        if (objError) {
          reject(objError);
        } else {
          resolve(objData);
        }
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
    const objParams = { Bucket: objConfig.bucket, Key: `${strPath}/${strName}` };
    return new Promise((resolve, reject) => {
      resolve(objS3.getObject(objParams).createReadStream());
    });
  }


  /**
   * This function clean uploaded files.
   * @param  {Array} listFiles List of multer files
   */
  function removeFiles(listFiles={}) {
    let listObjects = [];

    Object.keys(listFiles).forEach((strKey) => {
      listFiles[strKey].forEach((objFile) => {
        listObjects.push({ Key: objFile.path });
      });
    });


    const objParams = {
      Bucket: objConfig.bucket,
      Delete: {
        Objects: listObjects,
        Quiet: true
      }
    };


    return new Promise((resolve, reject) => {
      objS3.deleteObjects(objParams, function(objError, objData) {
        if (objError) {
          return reject(objError);
        }


        return resolve(objData);
      });
    });
  }


  /**
   * This function remove a single uploaded file.
   * @param  {Object}   req      Request Object
   * @param  {Object}   objFile  File Stream
   * @param  {Function} callback Multer Callback
   */
   function removeFile(req, objFile, callback) {
      const objParams = {
        Bucket: objConfig.bucket,
        Key: objFile.path,
      };


      objS3.deleteObject(objParams, callback);
   }


   /**
    * This function retrieve the upload destination.
    * @param  {Object}   req         Request object.
    * @param  {Object}   objFile File name object.
    */
   function getDestination(req, objFile) {
     return new Promise((resolve, reject) => {
       return objConfig.path ? resolve(objConfig.path) : reject();
     });
   }


   return {
    fnWriteStream: diskWriteStream,
    fnReadStream: diskReadStream,
    removeFile,
    removeFiles,
    getDestination,
    getFilename: null
   };
}
