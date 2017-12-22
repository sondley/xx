'use strict';


const Handler = require('./handler');
const Config = require('../../../config');
const Boom = require('boom');
const Joi = require('joi');
const ENUMS = require('../../enums');

// var UploadFiles = require('../../prehandlers/upload-files');


////////////////////////////////////////////////////////////


function VideosModule(objServer, objOptions, fnNext) {
  const objSequelize = objServer.plugins['hapi-sequelize'][Config.sequelize.database];
  const objUserHandler = Handler(objSequelize);


  objServer.route([
    {
      method: 'POST',
      path: '/',
      config: {
        // auth: false,
        payload: {
          output: 'stream',
          parse: true,
          // parse: false,
          maxBytes: 50000000,
          allow: ['application/json', 'multipart/form-data']
        },
        // pre: [
          // { method: UploadFiles.create({ destination: __dirname + "/../../files/videos/", key: 'file' }).handler }
        // ],
        handler: function (objRequest, fnReply) {
          return objServer.methods.uploadSingleFile(objRequest.payload.video).then((objData) => {
            const objPayload = Object.assign({}, objRequest.payload, { video: objData });
            return objUserHandler.createVideo(objPayload, objRequest.auth.user).then((objResult) => {
              fnReply({ statusCode: 201, results: objResult }).code(201);
            });
          }).catch((e) => {
            console.log(e);
            fnReply(Boom.badImplementation('Invalid Data'));
          });
            // var data = request.payload;
        }
      }
    },
    {
      method: 'GET',
      path: '/user/me',
      config: {
        handler: function (objRequest, fnReply) {
          return objUserHandler.getMyVideos(objRequest.auth.user).then((listVideos) => {
            fnReply({ statusCode: 200, results: listVideos });
          }).catch((e) => {
            fnReply(Boom.badImplementation('Invalid Data'));
          });
        }
      }
    },
    {
      method: 'GET',
      path: '/stream/{videoid}',
      config: {
        auth: false,
        handler: function (objRequest, fnReply) {
          const strVideoId = encodeURIComponent(objRequest.params.videoid);
          return objUserHandler.getVideoUrl(strVideoId).then((strVideoUrl) => {
            fnReply.redirect(strVideoUrl);
          }).catch((e) => {
            fnReply(Boom.badImplementation('Invalid Data'));
          });
        }
      }
    }
  ]);

  fnNext();
};


////////////////////////////////////////////////////////////


exports.register = VideosModule;

exports.register.attributes = {
  name: 'Videos'
};
