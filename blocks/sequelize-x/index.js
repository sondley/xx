"use strict";


module.exports = { initialize: initSequelize };


const Fs = require('fs');
const Path = require('path');
const Sequelize = require('sequelize');
const Lodash = require('lodash');
const UnaccentQuery = require('./unaccent_query.js');
const objDb = {};


////////////////////////////////////////////////////////////


/**
 * This function initialize the sequelize engine.
 * @param  {Object} objCredentials Database credentials.
 * @param  {Object} objSequelizeConfig   Sequalize config
 * @param  {String} strModelsPath   Path containing models files
 * @param  {Object} objSync   Sequalize sync object
 * @return {Object}                Sequalize
 */
function initSequelize(objCredentials, objSequelizeConfig, strModelsPath, objSync) {
  let objSequelize = new Sequelize(objCredentials.database, objCredentials.username, objCredentials.password, objSequelizeConfig);
  loadModels(strModelsPath, objSequelize);
  loadModelsAssociation();

  return Lodash.extend({
    syncPromise: syncDatabase(objSync, objSequelize),
    sequelize: objSequelize,
    Sequelize: Sequelize,
    custom: {
      createUnaccentQuery: UnaccentQuery
    }
  }, objDb);
};


/**
 * This function load the modules dynamically
 * @param  {String} strModelsPath   Path containing models files
 * @param  {Object} objSequelize     sequalize instance.
 */
function loadModels(strModelsPath, objSequelize) {
  let listFields = Fs.readdirSync(strModelsPath);

  listFields = listFields.filter((file) => {
    return (file.indexOf('.') !== 0) && (file !== 'index.js')
  });

  listFields = listFields.forEach((strFileName) => {
    const objModel = objSequelize.import(Path.join(strModelsPath, strFileName));
    objDb[objModel.name] = objModel;
  });
}


/**
 * This function load the models association.
 */
function loadModelsAssociation() {
  Object.keys(objDb).forEach((modelName) => {
    if (objDb[modelName].options.hasOwnProperty('associate')) {
      objDb[modelName].options.associate(objDb);
    }
  });
}


/**
 * This function sync the database with the models.
 * @param  {Object} objSync Sequelize sync.
 * @param  {Object} sequelize     sequalize instance. 
 */
function syncDatabase(objSync, sequelize) {
  return sequelize.sync(objSync);
}