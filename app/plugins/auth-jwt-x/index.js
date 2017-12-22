'use strict';

const jwt = require('hapi-auth-jwt2');
const UserHandler = require('../../handlers/users/handler');
const Config = require('../../../config');

exports.register = (objServer, options, next) => {
  const objSequelize = objServer.plugins['hapi-sequelize'][Config.sequelize.database];
  const objUserHandler = UserHandler(objSequelize);
  
  objServer.register(jwt, registerAuth);

  
  function registerAuth (err) {
    if (err) { return next(err); }

    objServer.auth.strategy('jwt', 'jwt', {
      key: options.secret,
      validateFunc: validate,
      verifyOptions: {algorithms: [ 'HS256' ]}
    });

    objServer.auth.default('jwt');

    return next();
  }


  function validate (decoded, request, cb) {
    return objUserHandler.getById(objSequelize.models.Users, decoded.id).then((objUser) => {
      if (!objUser) {
        return cb(null, false);
      }

      request.auth.user = objUser;
      return cb(null, true);
    });
  }
};


exports.register.attributes = {
  name: 'auth-jwt',
  version: '1.0.0'
};