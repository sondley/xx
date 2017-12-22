'use strict';


module.exports = {
  up: (objQueryInterface, Sequelize) => {
    return objQueryInterface.bulkInsert('MediaTypes', [
      { name: 'Videos', created_at: new Date(), updated_at: new Date() },
      { name: 'Images', created_at: new Date(), updated_at: new Date() }
    ], {});
  },

  
  down: (objQueryInterface, Sequelize) => {
    return queryInterface.bulkDelete('MediaTypes', null, {});
  }
};
