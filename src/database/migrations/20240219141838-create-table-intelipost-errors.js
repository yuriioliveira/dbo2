'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('intelipost_errors', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false
      },
      id_anymarket: {
        type: Sequelize.BIGINT,
        unique: true,
      },
      id_entrega: {
        type: Sequelize.BIGINT,
        unique: true,
        allowNull: false,
        primaryKey: true
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
    return queryInterface.dropTable('intelipost_errors');
  }
};
