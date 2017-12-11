"use strict";


module.exports = { isValidPassword, hashPassword };


let bcrypt = require('bcrypt');


////////////////////////////////////////////////////////////


/**
 * This function check if the password is valid.
 * @param  {String}  strInputPassword Input password.
 * @param  {String}  strUserPassword User Saved Password
 * @return {Boolean}         Status of the password.
 */
function isValidPassword(strInputPassword, strUserPassword) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(strInputPassword, strUserPassword, (objError, isValid) => {
      if (objError) {
        return reject(objError);
      }

      return isValid ? resolve() : reject();
    });
  });
}


/**
 * This function hash the user password.
 * @param  {String} strInputPassword Input password.
 * @return {String}                  Hashed password.
 */
function hashPassword(strInputPassword) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(strInputPassword, 10, (objError, strHash) => {
      if (objError) {
        return reject(objError);
      }

      return resolve(strHash);
    });
  });
}