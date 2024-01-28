const { Model, DataTypes } = require('sequelize');

class IntegracaoBsellerErros extends Model {
    static init(sequelize) {
        super.init({
            id_anymarket: DataTypes.INTEGER,
            fulfillment: DataTypes.BOOLEAN,
            status_anymarket: DataTypes.STRING,
        }, {
            sequelize
          })
        }
}

module.exports = IntegracaoBsellerErros;