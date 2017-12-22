'use strict';


const Jwt = require('../../utils/jwt');
const BcryptX = require('../../../blocks/bcrypt-x');
const ExcludedFields = require('../../excluded-fields');
const ENUMS = require('../../enums');
const Lodash = require('lodash');
const fs = require('fs');
// const AmazonS3 = require('../../../blocks/amazon-s3');
const Op = require('sequelize').Op;
const Config = require('../../../config');
var AWS = require('aws-sdk');
var awsconfig = new AWS.Config({
  accessKeyId: Config.amazon.s3.accessKeyId,
  secretAccessKey: Config.amazon.s3.secretAccessKey,
  region: 'us-west-1'
});


////////////////////////////////////////////////////////////



function MakeVideosHandler(objSequelize) {

  function uploadToS3(strFilePath, strFileName) {
    return new Promise((resolve, reject) => {
      var s3 = new AWS.S3(awsconfig);
      fs.readFile(strFilePath, function(err, objFile) {
        var params = {
          Bucket: 'fluttr-dev',
          Key: strFileName,
          Body: objFile,
          ACL:'public-read'
        };
  
        s3.putObject(params, function (objError, objResult) {
          if (objError) {
            return reject(objError);
          };

          resolve(objResult);
          fs.unlink(strFilePath, function (err) {
            if (err) {
              throw err;
            }
          });
        });
      });
    });
  };


  function createVideo(objPayload, objCurrentUser) {
    return uploadToS3(objPayload.video.path, objPayload.video.filename).then((objData) => {
      const objVideo = Object.assign({ thumbnail: 'http://placehold.it/350', user_id: objCurrentUser.id }, Lodash.omit(objPayload, ['video']));
      return objSequelize.models.Videos.create(objVideo).then((objNewVideo) => {
        const objMedia = Object.assign({}, objPayload.video, { type_id: 1, video_id: objNewVideo.id, user_id: objCurrentUser.id });
        return objSequelize.models.Media.create(objMedia).then((objMedia) => {
          return Object.assign({}, objNewVideo.get({ plain: true }), { Medias: [objMedia] });
        });
      });
    });
  }


  function getMyVideos(objCurrentUser) {
    return objSequelize.models.Videos.findAll({ where: { user_id: objCurrentUser.id }, include: [{
      model: objSequelize.models.Media,
      as: 'Medias',
      // attributes: { exclude: ExcludedFields.GetUser },
      required: true
    }] });
  }


  function getVideoUrl(intId) {
    const listIncludes = [{
      model: objSequelize.models.Media,
      as: 'Medias',
      // attributes: { exclude: ExcludedFields.GetUser },
      required: true
    }]

    return getById(objSequelize.models.Videos, intId, listIncludes).then((objVideo) => {
      return getFullFilePath(objVideo.Medias[0].filename);
    });
    // const objParams = { Bucket: objConfig.bucket, Key: `${strPath}/${strName}` };
    // return new Promise((resolve, reject) => {
    //   resolve(objS3.getObject(objParams).createReadStream());
    // });
  }


  /**
   * This function retrieve a single Object.
   * @param  {Integer} intId Object Id.
   * @param  {Array} listInclude List include objects.
   * @param  {Object} objAttributes Attributes object.
   * @return {Promise}               Single Object.
   */
  function getById(objModel, intId, listInclude, objAttributes) {
    let objWhereClause = { id: intId };
    return getOne(objModel, objWhereClause, listInclude, objAttributes);
  }

  function getOne(objModel, objWhereClause, listInclude, objAttributes) {
    return objModel.findOne({
      include: listInclude,
      attributes: objAttributes,
      where: objWhereClause
    });
  }


  /**
   * This function get the full path.
   * @param  {String} strVideoId Video ID
   * @return {String}             Amazon Url
   */
  function getFullFilePath(strFilename) {
    return `https://s3-us-west-1.amazonaws.com/${Config.amazon.s3.buckets.videos}/${strFilename}`;
  }


  return {
    createVideo,
    getMyVideos,
    getVideoUrl
  }
}


// UserController.prototype.create = function (request, reply) {
//   let payload = request.payload;
//   // username
//   // email
//   // role_id
//   this.model.createAsync(payload)
//   .then((user) => {
//     let token = getToken(user.id);

//     reply({
//       token: token
//     }).code(201);
//   })
//   .catch((err) => {
//     reply(Boom.badImplementation(err.message));
//   });
// };

// UserController.prototype.logIn = function (request, reply) {
//   let credentials = request.payload;

//   this.model.findOneAsync({email: credentials.email})
//   .then((user) => {
//     if (!user) {
//       return reply(Boom.unauthorized('Email or Password invalid'));
//     }

//     if (!user.validatePassword(credentials.password)) {
//       return reply(Boom.unauthorized('Email or Password invalid'));
//     }

//     let token = getToken(user.id);

//     reply({
//       token: token
//     });
//   })
//   .catch((err) => {
//     reply(Boom.badImplementation(err.message));
//   });
// };


////////////////////////////////////////////////////////////


module.exports = MakeVideosHandler;