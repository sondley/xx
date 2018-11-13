'use strict';


const Hapi = require('hapi');
const joi = require('joi');
const Good = require('good');
const Config = require('./config');

const UploadSingleFilePlugin = require('./app/plugins/upload-single-file');
const SequelizeX = require('./blocks/sequelize-x').initialize(Config.sequelize, Config.sequelize, Config.modelsDir);
const server = new Hapi.Server();
const CrudX = require('./app/plugins/crud-x');

server.connection({
  routes: {
    cors: {
      origin: ['*'],
      headers: ["Accept", "Authorization", "Content-Type", "If-None-Match", "Accept-language"]
    }
  },
  port: 3000, host: 'api-facturationx.herokuapp.com'
});


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


const objUsersCrudConfig = {
  model: 'Users',
  path: '/_users'
}


const objCustomersCrudConfig = {
  model: 'Customers',
  path: '/customers'
}


const objPurchasesCrudConfig = {
  model: 'Purchases',
  path: '/purchases'
}


const objProvidersCrudConfig = {
  model: 'Providers',
  path: '/providers'
}


const objSalesCrudConfig = {
  model: 'Sales',
  path: '/sales'
}


const listModels = [
  objSalesCrudConfig,
  objProvidersCrudConfig,
  objCustomersCrudConfig,
  objUsersCrudConfig,
  objPurchasesCrudConfig
];


const objCrudConfig = {
  register: CrudX,
  options: {
    name: Config.sequelize.database,
    modelsConfig: listModels
  }
}

server.log('info', 'Server running at: ' + server.info.uri);

server.register([objDatabaseConfig], (objError) => {

  server.register([objCrudConfig], (objError) => {
    if (objError) {
      throw objError;
    }

    console.log("heloo----Sondley----");

    server.start((objError) => {
      server.table()[0].table.forEach((route) => console.log(`${route.method}\t${route.path}`));

      if (objError) {
          throw objError;
      }
      server.log('info', 'Server running at: ' + server.info.uri);
    });
  });
  
});
