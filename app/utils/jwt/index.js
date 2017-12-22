"use strict";


const JwtConfig = require('../../../config').auth.jwt;
const JwtX = require('../../../blocks/jwt-x');


////////////////////////////////////////////////////////////


const objJwt = JwtX(JwtConfig);


////////////////////////////////////////////////////////////


module.exports = objJwt;
