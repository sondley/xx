"use strict";


module.exports = Init;


const JWT = require('jsonwebtoken');
const Lodash = require('lodash');


////////////////////////////////////////////////////////////


function Init(JwtConfig) {


  /**
   * This function parse the create token payload
   */
  function parseCreateTokenPayload(objPayload) {
    const { data, options, secret, omit } = objPayload;
    const objTokenData = Object.assign({ _date: new Date() }, Lodash.omit(data, omit));
    const objJwtOptions = Object.assign({}, JwtConfig.sign, options);
    const varSecret = secret ? secret : JwtConfig.secret;

    return [objTokenData, varSecret, objJwtOptions];
  }


  /**
   * This function parse the verify token payload
   */
  function parseVerifyTokenPayload(objPayload) {
    const { token, options, secret } = objPayload;
    const objJwtOptions = Object.assign({}, JwtConfig.verify, options);
    const varSecret = secret ? secret : JwtConfig.secret;

    return [token, varSecret, objJwtOptions];
  }


  /**
   * This function create the token
   * @param {Object} objPayload 
   */
  function createToken(objPayload) {
    return new Promise((fnResolve, fnReject) => {
      const listParameters = parseCreateTokenPayload(objPayload);
      return JWT.sign(...listParameters, (varError, strToken) => {
        if(varError) {
          return fnReject(varError);
        }

        return fnResolve(strToken);
      });
    });
  }


  /**
   * This function create the token (Sync)
   * @param {Object} objPayload 
   */
  function createTokenSync(objPayload) {
    const listParameters = parseCreateTokenPayload(objPayload);
    return JWT.sign(...listParameters);
  }


  function verifyToken(objPayload) {
    return new Promise((fnResolve, fnReject) => {
      const listParameters = parseVerifyTokenPayload(objPayload);
      return JWT.verify(...listParameters, (varError, strToken) => {
        if(varError) {
          return fnReject(varError);
        }

        return fnResolve(strToken);
      });
    });
  }


  function verifyTokenSync(objPayload) {
    const listParameters = parseVerifyTokenPayload(objPayload);
    return JWT.verify(...listParameters);
  }


  return {
    createToken,
    createTokenSync,
    verifyToken,
    verifyTokenSync
  };
}