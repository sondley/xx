"use strict";


module.exports = createUnaccentQuery;


const Op = require('sequelize').Op;


////////////////////////////////////////////////////////////


/**
 * This function transform a query to an unaccent query.
 * @param  {Object} objOriginalQuery Original query
 * @param  {Object} sequelize        Sequelize object.
 * @return {Object}                  Unaccent query.
 */
function createUnaccentQuery(objOriginalQuery, sequelize, logicOperator) {
  logicOperator = logicOperator || [Op.and];

  let objQuery = {};
  objQuery[logicOperator] = [];

  for (let x in objOriginalQuery) {
    if (objOriginalQuery[x] && objOriginalQuery[x][Op.iLike]) {
      objQuery[logicOperator].push(sequelize.where(sequelize.fn('unaccent', sequelize.col(x)), { [Op.iLike]: sequelize.fn('unaccent', objOriginalQuery[x][Op.iLike]) }));
    }
    else {
      objQuery[x] = objOriginalQuery[x];
    };
  }
  return objQuery;
}