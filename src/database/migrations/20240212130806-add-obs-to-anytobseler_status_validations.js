'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('anytobseller_status_validations', 'observacoes', { type: Sequelize.STRING, });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('anytobseller_status_validations', 'observacoes');
  }
};
