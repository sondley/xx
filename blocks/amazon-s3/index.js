"use strict";


var s3 = require('s3');
var fs = require('fs');
var S3Stream = require('s3-upload-stream');


class S3Client {


  /**
   * Client constructor
   * @param  {string} bucketName   Name of the existing S3 bucket
   * @param  {Object} configParams Parameters to pass to the S3 client
   */
  constructor(bucketName, accessKey, secretKey, configParams) {
    if (!bucketName) {
      throw "Invalid bucketName value.";
    }

    this.bucketName = bucketName;
    this.params = {
      maxAsyncS3: 20,
      s3RetryCount: 3,
      s3RetryDelay: 1000,
      multipartUploadThreshold: 20971520, // this is the default (20 MB)
      multipartUploadSize: 15728640, // this is the default (15 MB)
      s3Options: {
        accessKeyId: accessKey,
        secretAccessKey: secretKey,
        region: "s3-us-west-1",
        s3ForcePathStyle: true,
signatureVersion: 'v4',
        endpoint: 's3.amazonaws.com'
      },
    };

    this.uploadedFiles = [];

    Object.assign(this.params, configParams || {});
    this.client = s3.createClient(this.params);
    this.client.shouldDisableBodySigning = () => true
  }


  /**
   * [upload description]
   * @param  {[type]} filePath   [description]
   * @param  {String} remotePrefix [description]
   * @return {[type]}            [description]
   */
  upload(filePath, remotePrefix) {
    let params = {
      localFile: filePath,
      s3Params: {
        Bucket: this.bucketName,
        Key: (remotePrefix || '') + filePath.split("/").pop(),
        ACL: 'public-read'
      }
    };
    return new Promise((resolve, reject) => {
      console.log(JSON.stringify(params, null, 2));
      let uploader = this.client.uploadFile(params);
      uploader.on('end', () => {
        console.log('dasd');
        resolve();
      });
      uploader.on('progress', function() {
        console.log("progress", uploader.progressMd5Amount,
                  uploader.progressAmount, uploader.progressTotal);
      });
      uploader.on('error', (e) => {
        console.log('dasssssssd', e);
        reject();
      });
    });
  }


  /**
   * This function filter the uploaded files.
   * @param  {String}   strLocalFile Local file name
   * @param  {Array}   listFiles List of file names.
   * @param  {Function} callback  Callback fn
   */
  _filterFiles(strLocalFile, listFiles, callback) {
    for (let x in listFiles) {
      if (strLocalFile.endsWith(listFiles[x])) {
        this.uploadedFiles.push(strLocalFile);
        callback(null, true);
        return;
      }
    }

    callback(null, null);
  }


  /**
   * Sync local directory with remote bucket directory
   * @param  {String} localPath    Local path string
   * @param  {String} remotePrefix Remote bucket prefix
   * @return {Promise}             Result promise
   */
  syncDir(localPath, remotePrefix, listFiles, hasAutoClean) {
    this.uploadedFiles = [];

    let params = {
      localDir: localPath,
      deleteRemoved: false,
      s3Params: {
        Bucket: this.bucketName,
        ACL: 'public-read',
        Prefix: remotePrefix || ""
      }
    };

    if (listFiles) {
      params.getS3Params = (localFile, stat, callback) => { this._filterFiles(localFile, listFiles, callback) };
    }

    return new Promise((resolve, reject) => {
      let uploader = this.client.uploadDir(params);

      uploader.on('end', () => {
        if (hasAutoClean) {
          this.deleteFiles(this.uploadedFiles);
        }

        resolve();
      });

      uploader.on('error', () => {
        reject();
      });
    });
  }


  /**
   * This function remove files.
   * @param  {Array} listFiles List of files path
   */
  deleteFiles(listFiles) {
    listFiles.forEach((strPath) => {
      fs.unlink(strPath);
    });
  }


  /**
   * This function check if a file exists.
   * @param  {String}  strFilePath File path.
   * @return {Promise}             File path.
   */
  isFileExists(strFilePath) {
    return new Promise((resolve, reject) => {
      this.client.s3.headObject({
        Bucket: this.bucketName,
        Key: strFilePath
      }, (objError, objData) => {
        if (objError) {
          reject();
        }
        else {
          resolve(this.getFullFilePath(strFilePath));
        }
      });
    });
  }


  /**
   * This function get the full path.
   * @param  {String} strFilePath Local file path
   * @return {String}             Amazon Url
   */
  getFullFilePath(strFilePath) {
    return `https://s3.amazonaws.com/${this.bucketName}/${strFilePath}`;
  }
}


module.exports = S3Client;
