const { Model, DataTypes } = require('sequelize');

class Bseller extends Model {
    static init(sequelize) {
        super.init({
            id_anymarket: DataTypes.INTEGER,
            id_entrega: DataTypes.INTEGER,
            status_bseller: DataTypes.STRING,
            chave_nf: DataTypes.STRING,
            numero_nf: DataTypes.STRING,
            serie_nf: DataTypes.STRING,
            data_nf: DataTypes.STRING,
            app_pagamento_aprovado: DataTypes.BOOLEAN,
            app_data_aprovacao_pagamento: DataTypes.STRING
        }, {
            sequelize
          })
        }
}

module.exports = Bseller;