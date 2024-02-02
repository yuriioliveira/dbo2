'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('bsellertointelipost_status_validations', { 
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
      },
      id_anymarket: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        unique: true,
        allowNull: false
      },
      id_entrega: {
        type: Sequelize.BIGINT,
        allowNull: false,
        unique: true
      },
      status_bseller: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      status_intelipost: {
        type: Sequelize.STRING,
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
    return queryInterface.dropTable('bsellertointelipost_status_validations');
  }
};
