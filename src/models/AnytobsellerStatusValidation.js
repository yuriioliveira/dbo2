const { Model, DataTypes } = require('sequelize');

class AnytobsellerStatusValidation extends Model {
    static init(sequelize) {
        super.init({
            id_anymarket: DataTypes.BIGINT,
            id_entrega: DataTypes.BIGINT,
            status_anymarket: DataTypes.STRING,
            status_bseller: DataTypes.STRING,
            chave_nf: DataTypes.STRING,
            numero_nf: DataTypes.STRING,
            serie_nf: DataTypes.STRING,
            observacoes: DataTypes.STRING,
        }, {
            sequelize
          })
        }
}

module.exports = AnytobsellerStatusValidation;