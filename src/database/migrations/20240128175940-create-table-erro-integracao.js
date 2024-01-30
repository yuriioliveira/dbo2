'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('integracao_bseller_erros', { 
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
      },
      id_anymarket: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        allowNull: false,
      },
      fulfillment: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      status_anymarket: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('integracao_bseller_erros');
  }
};
