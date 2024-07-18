'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('shopee_orders', { 
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
      },
      id_anymarket: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        allowNull: false,
        unique: true,
      },
      id_entrega: {
        type: Sequelize.BIGINT,
        allowNull: false,
        unique: true,
      },
      id_marketplace: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      status_anymarket: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      status_bseller: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      status_marketplace: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      data_pedido: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      chave_nf_any: Sequelize.STRING,
      numero_nf_any: Sequelize.STRING,
      serie_nf_any: Sequelize.STRING,
      data_nf_any: Sequelize.STRING,
      chave_nf_bseller: Sequelize.STRING,
      numero_nf_bseller: Sequelize.STRING,
      serie_nf_bseller: Sequelize.STRING,
      data_nf_bseller: Sequelize.STRING,
      valor_total: {
        type: Sequelize.DECIMAL,
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
    return queryInterface.dropTable('shopee_orders');
  }
};
