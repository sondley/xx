'use strict';


// const Boom = require('boom');
const Handler = require('./handler');
const Config = require('../../../config');
const Boom = require('boom');
const Joi = require('joi');
const ENUMS = require('../../enums');

// var UploadFiles = require('../../prehandlers/upload-files');


////////////////////////////////////////////////////////////


function UsersModule(objServer, objOptions, fnNext) {
  const objSequelize = objServer.plugins['hapi-sequelize'][Config.sequelize.database];
  const objUserHandler = Handler(objSequelize);
  objServer.route([
    {
      method: 'POST',
      path: '/signup',
      config: {
        auth: false,
        //TODO: Refactor JOI validation
        handler: function (objRequest, fnReply) {
          objUserHandler.signup(objRequest.payload).then((objUser) => {
            fnReply({ statusCode: 201, results: objUser }).code(201);
          }).catch((objError) => {
            console.log(objError);
            if (objError.name == 'SequelizeUniqueConstraintError') {
              return fnReply(Boom.conflict(objError.errors[0].message));
            }

            fnReply(Boom.badImplementation('Invalid Data'));
          });
        },
        validate: {
          payload: {
            username: Joi.string().alphanum().min(3).max(30).required(),
            email: Joi.string().email().required(),
            password: Joi.string().min(6).max(200).required()
          }
        }
      }
    },
    {
      method: 'POST',
      path: '/login',
      // auth: false,
      config: {
        auth: false,
        handler: function (objRequest, fnReply) {
          objUserHandler.login(objRequest.payload).then((objUser) => {
            fnReply({ statusCode: 200, results: objUser });
          }).catch((objError) => {
            if (objError.type == ENUMS.HTTP_CODE.INVALID_CREDENTIALS) {
              return fnReply(Boom.unauthorized('Invalid Credentials'));
            }

            fnReply(Boom.badImplementation('Invalid Data'));
          });
        },
        validate: {
          payload: {
            email: Joi.string().email().required(),
            password: Joi.string().min(6).max(200).required()
          }
        }
      }
    }
  ]);

  fnNext();
};


////////////////////////////////////////////////////////////


exports.register = UsersModule;

exports.register.attributes = {
  name: 'Users'
};
