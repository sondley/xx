'use strict';


const Hapi = require('hapi');
const joi = require('joi');
const Good = require('good');
const Config = require('./config');
const CrudX = require('./app/plugins/crud-x');
const SequelizeX = require('./blocks/sequelize-x').initialize(Config.sequelize, Config.sequelize, Config.modelsDir);
const server = new Hapi.Server();


server.connection({ port: 3000, host: 'localhost' });


const objDatabaseConfig = {
  register: require('hapi-sequelize'),
  options: [
    {
      name: 'db',
      models: ['./sequelize/models/*.js'],
      sequelize: SequelizeX.sequelize,
      sync: true,
      forceSync: false
    }
  ]
};


const objRolesCrudConfig = {
  model: 'Roles',
  path: '/roles'
}


const objCategoriesCrudConfig = {
  model: 'Categories',
  path: '/categories'
}


const objCommentsCrudConfig = {
  model: 'Comments',
  path: '/comments'
}


const objHashtagsCrudConfig = {
  model: 'Hashtags',
  path: '/hashtags'
}


const objJobsCrudConfig = {
  model: 'Jobs',
  path: '/jobs'
}


const listModels = [
  objRolesCrudConfig,
  objCategoriesCrudConfig,
  objCommentsCrudConfig,
  objHashtagsCrudConfig,
  objJobsCrudConfig
];


const objCrudConfig = {
  register: CrudX,
  options: {
    name: 'db',
    modelsConfig: listModels
  }
}


server.register(objDatabaseConfig, (objError) => {
  server.register(objCrudConfig, (objError) => {
    if (objError) {
      throw objError;
    }

    server.start((objError) => {
      server.table()[0].table.forEach((route) => console.log(`${route.method}\t${route.path}`));

      if (objError) {
          throw objError;
      }
      server.log('info', 'Server running at: ' + server.info.uri);
    });
  });
});
