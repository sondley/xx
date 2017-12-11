


"use strict";


module.exports = { create: DynamicCrud };


let Lodash = require('lodash');
let Ramda = require('ramda');
let Boom = require('boom');


////////////////////////////////////////////////////////////



function createPayload(objOptions, objRequest) {
  const _objOptions = objOptions ? objOptions : {};

  const strId = Lodash.get(
    objRequest,
    ['params', 'id'],
    Lodash.get(objRequest,
      ['query', 'id'],
      Lodash.get(objRequest, ['payload', 'id'], null)
    )
  );


  const strSearchQuery = Lodash.get(objRequest, ['query', 'q'], null);
  let intLimit = Lodash.get(objRequest, ['query', 'limit'], null);
  intLimit = intLimit > 0 ? intLimit : _objOptions.limit || null;
  
  let intPage = Lodash.get(objRequest, ['query', 'page'], null);
  intPage = intPage > 0 ? intPage - 1 : 0;

  const varData = Lodash.get(objRequest, ['payload'], null);
  
  
  return {
    id: encodeURIComponent(strId),
    data: varData,
    q: strSearchQuery,
    query: {
      include: _objOptions.include,
      attributes: _objOptions.attributes,
      where: _objOptions.where,
      offset: intPage * intLimit,
      limit: intLimit,
      sort: _objOptions.sort
    },
    request: objRequest
  }
}


function DynamicCrud(objModel) {

  function getAll(objPayload) {
    const isWithCount = Lodash.get(objPayload, ['request', 'query', 'count'], null);
    if (isWithCount == true) {
      return objModel.findAndCountAll(objPayload.query);
    }
    return objModel.findAll(objPayload.query);
  }

  function getCount(objPayload) {
    return objModel.count(objPayload.query);
  }

  function getOne(objPayload) {
    Lodash.set(objPayload, ['query', 'limit'], 1);
    return objModel.findOne(objPayload.query);
  }


  function getById(objPayload) {
    if (!objPayload.id) {
      return Promise.resolve(Boom.notFound());
    }

    objPayload.query.where = Object.assign({}, objPayload.query.where, { id: objPayload.id });
    console.log(objPayload.query.where);
    return getOne(objPayload).then((objData) => {
      return !objData ? Boom.notFound() : objData;
    });
  }


  return {
    getOne: Ramda.compose(getOne, createPayload),
    getById: Ramda.compose(getById, createPayload),
    getAll: Ramda.compose(getAll, createPayload),
    getCount: Ramda.compose(getCount, createPayload)
  }
}