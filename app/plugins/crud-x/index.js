'use strict';
const Boom = require('boom');
const Crud = require('./crud-handler');


exports.register = function (server, options, next) {
  const objSequelize = server.plugins['hapi-sequelize'][options.name];

  options.modelsConfig.forEach((options) => {
    const ModelCrud = Crud.create(objSequelize.models[options.model]);


    const getOptions = (strType) => null;

    server.route([
      {
        method: 'GET',
        path: options.path,
        config: {
          handler: (request, reply) => {
            ModelCrud.getAll(getOptions('findAll'), request).then((varResponse) => {
              reply({ statusCode: 200, results: varResponse });
            });
          }
        }
      },
      {
        method: 'GET',
        path: `${options.path}/count`,
        config: {
          handler: (request, reply) => {
            ModelCrud.getCount(getOptions('count'), request).then((varResponse) => {
              reply({ statusCode: 200, results: varResponse });
            });
          }
        }
      },
      {
        method: 'GET',
        path: `${options.path}/{id}`,
        config: {
          handler: (request, reply) => {
            ModelCrud.getById(getOptions('findById'), request).then((varResponse) => {
              reply({ statusCode: 200, results: varResponse });
            });
          }
        }
      },
      {
        method: 'POST',
        path: options.path,
        config: {
          handler: (request, reply) => {
            // ModelCrud.create(getOptions('create'), request).then((varResponse) => {
            //   reply({ statusCode: 200, results: varResponse });
            // });

            objSequelize.models[options.model].create(request.payload).then((objData) => {
              reply(objData.get({ plain: true }));
            });

          }
        }
      },
      {
        method: 'PUT',
        path: `${options.path}/{id?}`,
        config: {
          handler: (request, reply) => {
            const intId = request.params.id ? encodeURIComponent(request.params.id) : null;
            const objPayload = Object.assign({}, request.payload, { id: intId });
            console.log(objPayload);


            return objSequelize.models[options.model].findById(intId).then((objResult) => {
              if (objResult) {
                let objUpdated = Object.assign(objResult.get({ plain: true }), objPayload);
                return objSequelize.models[options.model].update(objUpdated, { where: { id: intId }}).then((listResults) => {
                  reply(listResults);
                });
              }
              else {
                return objSequelize.models[options.model].create(objPayload).then((listResults) => {
                  reply(listResults);
                });
              };
            }).catch(console.log);
          }
        }
      },
      {
        method: 'DELETE',
        path: `${options.path}/{id}`,
        config: {
          handler: (request, reply) => {
            const intId = request.params.id ? encodeURIComponent(request.params.id) : null;
            objSequelize.models[options.model].destroy({ where: { id: intId } }).then((listResults) => {
              reply(listResults);
            });
          }
        }
      }
    ]);
  });

  next();
};

exports.register.attributes = {
  name: 'Crud-X'
};
