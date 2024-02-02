'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('intelipost_orders', {
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
      status_intelipost: Sequelize.STRING,
      chave_nf: Sequelize.STRING,
      numero_nf: Sequelize.STRING,
      serie_nf: Sequelize.STRING,
      data_nf: Sequelize.STRING,
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
    return queryInterface.dropTable('intelipost_orders');
  }
};
