const { Model, DataTypes } = require('sequelize');

class ShopeeOrder extends Model {
    static init(sequelize) {
        super.init({
            id_anymarket: DataTypes.BIGINT,
            id_entrega: DataTypes.BIGINT,
            id_marketplace: DataTypes.STRING,
            status_anymarket: DataTypes.STRING,
            status_bseller: DataTypes.STRING,
            status_marketplace: DataTypes.STRING,
            data_pedido: DataTypes.STRING,
            chave_nf_any: DataTypes.STRING,
            numero_nf_any: DataTypes.STRING,
            serie_nf_any: DataTypes.STRING,
            data_nf_any: DataTypes.STRING,
            chave_nf_bseller: DataTypes.STRING,
            numero_nf_bseller: DataTypes.STRING,
            serie_nf_bseller: DataTypes.STRING,
            data_nf_bseller: DataTypes.STRING,
            valor_total: DataTypes.DECIMAL,
        }, {
            sequelize
          })
        }
    }

module.exports = ShopeeOrder;