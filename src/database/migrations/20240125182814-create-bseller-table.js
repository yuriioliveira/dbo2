'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('bsellers', { 
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
      },
      id_anymarket: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      id_entrega: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
      },
      status_bseller: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      chave_nf: Sequelize.STRING,
      numero_nf: Sequelize.STRING,
      serie_nf: Sequelize.STRING,
      data_nf: Sequelize.STRING,
      app_pagamento_aprovado: Sequelize.BOOLEAN,
      app_data_aprovacao_pagamento: Sequelize.STRING,
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
    return queryInterface.dropTable('bsellers');
  }
};
