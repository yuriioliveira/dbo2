'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('anymarkets', { 
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
      id_marketplace: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      status_anymarket: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      status_marketplace: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      marketplace_nome: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      fulfillment: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      chave_nf: Sequelize.STRING,
      numero_nf: Sequelize.STRING,
      serie_nf: Sequelize.STRING,
      data_nf: Sequelize.STRING,
      valor_total: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      data_pedido: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      nome_cliente: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      documento_cliente: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      tipo_documento_cliente: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      pedido_integrado_bseller: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      app_nf_atualizada: Sequelize.BOOLEAN,
      app_data_nf_atualizada: Sequelize.STRING,
      app_status_pedido_atualizado: Sequelize.BOOLEAN,
      app_data_status_pedido_atualizado: Sequelize.STRING,
      app_faturamento_atrasado: Sequelize.BOOLEAN,
      app_data_faturamento_atrasado: Sequelize.STRING,
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
    return queryInterface.dropTable('anymarkets');
  }
};
