'use strict';


const Jwt = require('../../utils/jwt');
const BcryptX = require('../../../blocks/bcrypt-x');
const ExcludedFields = require('../../excluded-fields');
const ENUMS = require('../../enums');
const Lodash = require('lodash');
const Op = require('sequelize').Op;


////////////////////////////////////////////////////////////


function MakeUsersHandler(objSequelize) {
  

  // /**
  //  * This function handles the refresh token.
  //  * @param  {String} strRefreshToken Current refresh token
  //  * @return {Promise}          Refreshed tokens
  //  */
  // refreshToken(strRefreshToken) {
  //   let listInclude = [{
  //     model: this.db.User,
  //     as: 'User',
  //     attributes: { exclude: ExcludedFields.GetUser },
  //     required: true
  //   }];

  //   let objWhereClause = {
  //     [Op.and]: [ { refreshToken: strRefreshToken }, { refreshToken: { [Op.ne]: null } } ]
  //   };

  //   return super.getOne(objWhereClause, listInclude).then((objToken) => {
  //     if (objToken) {
  //       return this.login(objToken.User, objToken.deviceId, objToken.deviceToken).then((objResult) => lodash.omit(objResult.get({ plain: true }), ['id', 'deviceId', 'deviceToken', 'user_id']));
  //     }
  //     else {
  //       return Promise.reject("INVALID_REFRESH_TOKEN");
  //     };
  //   });
  // }

  function getOne(objModel, objWhereClause, listInclude, objAttributes) {
    return objModel.findOne({
      include: listInclude,
      attributes: objAttributes,
      where: objWhereClause
    });
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


  /**
   * This function retrieve a user based on a token.
   * @param  {String} strToken JWT Token.
   * @param  {String} strTokenType Token Type.
   * @return {Promise}          Current User.
   */
  function getByToken(strToken, strTokenType) {
    const objWhereClause = {
      [Op.and]: [{ token: strToken }, { token: { [Op.ne]: null } }],
      type_id: strTokenType
    };

    const listInclude = [{
      model: objSequelize.models.Users,
      as: 'User',
      attributes: { exclude: ExcludedFields.GetUser },
      required: true
    }];

    return getOne(objSequelize.models.Tokens, objWhereClause, listInclude).then((objToken) => {
      return objToken.User;
      // return verifyToken(objToken);
    });
  }


  /**
   * This function retrieve the user using a token.
   * @param  {Object} objToken Token instance
   * @param  {Object} objTokenConfig      Token Config
   * @return {Promise}                Status of the token
   */
  function verifyToken(objToken, objTokenConfig) {
    let strToken = objTokenConfig.field in objToken ? objToken[objTokenConfig.field] : objToken.token;
    const objVerifyOptions = { token: strToken, secret: objTokenConfig.secret };
    return Jwt.verifyToken(objVerifyOptions);
  }


  /**
   * This function retrieve a user based on the email.
   * @param  {String} strEmail User Email.
   * @param  {Array} listInclude List of associated objects.
   * @param  {Object} objAttributes Sequelize attributes.
   * @return {Promise}          User Objcet.
   */
  function getByEmail(strEmail, listInclude, objAttributes) {
    let objWhereClause = {
      [Op.and]: [
        objSequelize.models.Users.sequelize.where(objSequelize.models.Users.sequelize.fn('lower', objSequelize.models.Users.sequelize.col('email')), objSequelize.models.Users.sequelize.fn('lower', strEmail)),
        { email: { [Op.ne]: null } }
      ]
    };

    return getOne(objSequelize.models.Users, objWhereClause, listInclude, objAttributes);
  }

  
  function signup(objData) {
    return BcryptX.hashPassword(objData.password).then((strHashedPassword) => {
      const objNewUser = Object.assign({}, objData, { password: strHashedPassword });
      return objSequelize.models.Users.create(objNewUser).then((objData) => {
        const objUser = objData.get({ plain: true });
        return loginUser(objUser);
      });
    });
  }



  /**
   * This function handle the login token.
   * @param  {Object} objData Login Object
   * @param  {String} strDeviceId    Device ID.
   * @return {Object}                User Tokens
   */
  function login(objData) {
    return getByEmail(objData.email).then((objUser) => {
      if (!objUser) {
        return Promise.reject({ type: ENUMS.HTTP_CODE.INVALID_CREDENTIALS });
      }
      
      return BcryptX.isValidPassword(objData.password, objUser.password).then(() => {
        return loginUser(objUser.get({ plain: true }));
      }).catch(() => {
        return Promise.reject({ type: ENUMS.HTTP_CODE.INVALID_CREDENTIALS });
      });
    });
  }


  function loginUser(objUser) {
    const strToken = Jwt.createTokenSync({ data: objUser, omit: ExcludedFields.GetUser });
  
    const objRefreshTokenConfig = {
      expiresIn: '45 days'
    };
    const strRefreshToken = Jwt.createTokenSync({
      data: objUser,
      omit: ExcludedFields.GetUser,
      options: objRefreshTokenConfig
    });

    return {
      user: Lodash.omit(objUser, ExcludedFields.GetUser),
      token: strToken,
      refreshToken: strRefreshToken
    };
  }


  /**
   * This function handles the password update
   * @param  {Integer} intUserId User ID
   * @param  {String} strNewPassword New password
   * @return {Boolean}                Status of the operation.
   */
  // updatePassword(intUserId, strNewPassword) {
  //   //TODO: Remove sessions?
  //   return BcryptX.hashPassword(strNewPassword).then((strHashedPassword) => {
  //     return this.currentModel.update(
  //       { password: strHashedPassword },
  //       { where: { id: intUserId, role_id: this.roleId } }
  //     ).then((listStatus) => {
  //       return listStatus[0] == 0 ? Promise.reject('INVALID_TOKEN') : Promise.resolve();
  //     });
  //   });
  // }


  /**
   * This function updates the user password
   * @param  {Object} objCurrentUser Current User Object
   * @return {[type]}                [description]
   */
  // changePassword(objCurrentUser, strOldPassword, strNewPassword) {
  //   const INVALID_USER_PASSWORD = 'INVALID_USER_PASSWORD'
  //   if (objCurrentUser.password && strOldPassword && strNewPassword) {
  //     return BcryptX.isValidPassword(strOldPassword, objCurrentUser.password).then(() => {
  //       return this.updatePassword(objCurrentUser.id, strNewPassword);
  //     }).catch(() => INVALID_USER_PASSWORD);
  //   }

  //   return Promise.reject(INVALID_USER_PASSWORD);
  // }


  /**
   * This function resets the user password
   * @param  {String} strForgotToken       Forgot Token
   * @param  {String} strDeviceId    Device ID
   * @param  {String} strNewPassword New password
   * @return {Promise}                Status of the operation
   */
  // forgotPassword(strEmail, strDeviceId) {
  //   const INVALID_USER_ID = 'INVALID_USER_ID';
  //   const FORGOT_EMAIL_SENT = 'FORGOT_EMAIL_SENT';
  //   return this.getByEmail(strEmail).then((objUser) => {
  //     if (!objUser) {
  //       return Promise.reject(INVALID_USER_ID);
  //     }

  //     return this.tokenController.createForgotToken(objUser.id, strDeviceId).then((strForgotToken) => {
  //       this.sendForgotPasswordEmail(objUser, strForgotToken);
  //       return Promise.resolve(FORGOT_EMAIL_SENT);
  //     });
  //   });
  // }


  /**
   * This function send the forgot password email.
   * @param  {Object} objUser Current User Instance.
   * @param  {String} strForgotToken Forgot Token
   * @return {Promise}          Status of the email.
   */
  // sendForgotPasswordEmail(objUser, strForgotToken) {
  //   const strEmailTitle = 'Reset Password';
  //   let objForgotEmail = new this.mailX.Email(
  //     [objUser.email],
  //     strEmailTitle,
  //     { type: 'html', value: this.ForgotPasswordEmail(objUser, strForgotToken) }
  //   );

  //   return this.mailX.send(objForgotEmail);
  // }


  /**
   * This function reset the user password
   * @param  {String} strForgotToken       Forgot Token
   * @param  {String} strDeviceId    Device ID
   * @param  {String} strNewPassword New password
   * @return {Promise}                Status of the operation
   */
  // resetPassword(strForgotToken, strDeviceId, strNewPassword) {
  //   return this.tokenController.isForgotTokenValid(strForgotToken, strDeviceId).then((objToken) => {
  //     return this.updatePassword(objToken.user_id, strNewPassword);
  //   });
  // }



  return {
    signup,
    getById,
    login
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


module.exports = MakeUsersHandler;