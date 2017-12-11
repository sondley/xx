'use strict';


module.exports = {
  up: (objQueryInterface, Sequelize) => {
    return objQueryInterface.bulkInsert('Roles', [
      { name: 'Admin', created_at: new Date(), updated_at: new Date() },
      { name: 'User', created_at: new Date(), updated_at: new Date() }
    ], {});
  },

  
  down: (objQueryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Roles', null, {});
  }
};
