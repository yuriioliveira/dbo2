'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('bseller_orders', 'descricao_status', { type: Sequelize.STRING, });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('bseller_orders', 'descricao_status');
  }
};
