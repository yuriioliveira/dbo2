const { Model, DataTypes } = require('sequelize');

class StatusValidation extends Model {
    static init(sequelize) {
        super.init({
            id_anymarket: DataTypes.BIGINT,
            status_anymarket: DataTypes.STRING,
            status_bseller: DataTypes.STRING,
        }, {
            sequelize
          })
        }
}

module.exports = StatusValidation;