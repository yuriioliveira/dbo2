'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('anytobseller_status_validations', { 
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
      },
      id_anymarket: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        unique: true,
        allowNull: false,
      },
      id_entrega: Sequelize.BIGINT,
      status_anymarket: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      status_bseller: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      chave_nf: Sequelize.STRING,
      numero_nf: Sequelize.STRING,
      serie_nf: Sequelize.STRING,
      observacoes: Sequelize.STRING,
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
    return queryInterface.dropTable('anytobseller_status_validations');
  }
};
