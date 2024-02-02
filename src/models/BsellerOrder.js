const { Model, DataTypes } = require('sequelize');

class BsellerOrder extends Model {
    static init(sequelize) {
        super.init({
            id_anymarket: DataTypes.BIGINT,
            id_entrega: DataTypes.BIGINT,
            status_bseller: DataTypes.STRING,
            data_pedido: DataTypes.STRING,
            chave_nf: DataTypes.STRING,
            numero_nf: DataTypes.STRING,
            serie_nf: DataTypes.STRING,
            data_nf: DataTypes.STRING,
            pedido_integrado_intelipost: DataTypes.BOOLEAN,
            app_pagamento_aprovado: DataTypes.BOOLEAN,
            app_data_aprovacao_pagamento: DataTypes.STRING
        }, {
            sequelize
          })
        }
}

module.exports = BsellerOrder;