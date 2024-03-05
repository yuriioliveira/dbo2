'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('geral_orders', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
      id_entrega: {
        type: Sequelize.BIGINT,
        unique: true,
        allowNull: false,
      },
      id_anymarket_core: {
        type: Sequelize.BIGINT,
        unique: true,
        allowNull: false,
      },
      id_marketplace: Sequelize.STRING,
      valor_total: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      valor_frete: Sequelize.DECIMAL,
      data_pedido: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      forma_pagamento: Sequelize.STRING,
      data_aprovacao_pagamento: Sequelize.STRING,
      status: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      status_data: Sequelize.STRING,
      nome_marketplace: Sequelize.STRING,
      transportadora: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      origem_pedido: Sequelize.STRING,
      fulfillment: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      custo_frete_fulfillment: Sequelize.DECIMAL,
      cliente_nome: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      cliente_cpfcnpj: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      cliente_uf: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      cliente_cidade: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      cliente_bairro: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      nfe_chave: Sequelize.STRING,
      nfe_numero: Sequelize.STRING,
      nfe_serie: Sequelize.STRING,
      nfe_data: Sequelize.STRING,
      produtos: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      id_filial: Sequelize.STRING,
      despesas_financeiras: Sequelize.DECIMAL,
      unidade_negocio: Sequelize.STRING,
      usuário_inclusao: Sequelize.STRING,
      id_canal: Sequelize.STRING,
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
    return queryInterface.dropTable('geral_orders');
  }
};
