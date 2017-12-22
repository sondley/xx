'use strict';


const Hapi = require('hapi');
const joi = require('joi');
const Good = require('good');
const Config = require('./config');
const VideosHandler = require('./app/handlers/videos');
const UsersHandler = require('./app/handlers/users');
const UploadSingleFilePlugin = require('./app/plugins/upload-single-file');
const CrudX = require('./app/plugins/crud-x');
const AuthJwtX = require('./app/plugins/auth-jwt-x');
const SequelizeX = require('./blocks/sequelize-x').initialize(Config.sequelize, Config.sequelize, Config.modelsDir);
const server = new Hapi.Server();


server.connection({ port: 3000, host: 'localhost' });


const objDatabaseConfig = {
  register: require('hapi-sequelize'),
  options: [
    {
      name: Config.sequelize.database,
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
    name: Config.sequelize.database,
    modelsConfig: listModels
  }
}


const objVideosModule = {
  register: VideosHandler,
  routes: { prefix: '/videos' }
}


const objUsersModule = {
  register: UsersHandler
}

const objUploadSingleFile = {
  register: UploadSingleFilePlugin,
  options: {
    destination: Config.videosDir
  }
}


const objJwtAuth = {
  register: AuthJwtX,
  options: {
    secret: Config.auth.jwt.secret
  }
}


server.register([objDatabaseConfig, objUploadSingleFile], (objError) => {
  server.register([objJwtAuth], (objError) => {
    server.register([objUsersModule], { routes: { prefix: '/users' } }, (objError) => {
      server.register([objCrudConfig, objVideosModule], (objError) => {
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
  });
});
