const { Model, DataTypes } = require('sequelize');

class Intelipost extends Model {
    static init(sequelize) {
        super.init({
            id_anymarket: DataTypes.BIGINT,
            id_entrega: DataTypes.BIGINT,
            status_intelipost: DataTypes.STRING,
            chave_nf: DataTypes.STRING,
            numero_nf: DataTypes.STRING,
            serie_nf: DataTypes.STRING,
            data_nf: DataTypes.STRING,
        }, {
            sequelize
          })
        }
}

module.exports = Intelipost;