"use strict";


const Config = require('../config');


module.exports = {
  development: Config.sequelize,
  test: Config.sequelize,
  production: Config.sequelize
};