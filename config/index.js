"use strict";


module.exports = getConfig();


////////////////////////////////////////////////////////////


/**
 * This function retrieve the enviroment config.
 * @return {Object} Enviroment config
 */
function getConfig() {
  var lodash = require('lodash');
  var strEnv = process.env.NODE_ENV || 'development';
  let objConfig = lodash.assign(
    require(__dirname + '/env/all.js'),
    require(__dirname + '/env/' + strEnv + '.js') || {}
  );

  return objConfig;
}