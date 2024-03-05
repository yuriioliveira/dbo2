const { Model, DataTypes } = require('sequelize');

class IntelipostErrors extends Model {
    static init(sequelize) {
        super.init({
            id_anymarket: DataTypes.BIGINT,
            id_entrega: DataTypes.BIGINT
        }, {
            sequelize
          })
        }
}

module.exports = IntelipostErrors;