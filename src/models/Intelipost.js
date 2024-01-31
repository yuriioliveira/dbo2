const { Model, DataTypes } = require('sequelize');

class Intelipost extends Model {
    static init(sequelize) {
        super.init({
            id_anymarket: DataTypes.BIGINT,
            id_entrega: DataTypes.BIGINT,
            id_marketplace: DataTypes.STRING,
            status_anymarket:DataTypes.STRING,
            status_bseller: DataTypes.STRING,
            status_marketplace: DataTypes.STRING,
            status_intelipost: DataTypes.STRING,
            nota_fiscal_anymarket: DataTypes.JSONB,
            nota_fiscal_intelipost: DataTypes.JSONB,
        }, {
            sequelize
          })
        }
}

module.exports = Intelipost;