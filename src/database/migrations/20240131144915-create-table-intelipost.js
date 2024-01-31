'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('inteliposts', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false
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
      id_marketplace: {
        type: Sequelize.STRING,
        allowNull: false
      },
      status_anymarket: {
        type: Sequelize.STRING,
        allowNull: false
      },
      status_bseller: {
        type: Sequelize.STRING,
        allowNull: false
      },
      status_marketplace: {
        type: Sequelize.STRING,
        allowNull: false
      },
      status_intelipost: Sequelize.STRING,
      nota_fiscal_anymarket: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      nota_fiscal_intelipost: {
        type: Sequelize.JSONB,
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
    return queryInterface.dropTable('inteliposts');
  }
};
