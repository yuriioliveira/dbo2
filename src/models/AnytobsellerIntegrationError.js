const { Model, DataTypes } = require('sequelize');

class AnytobsellerIntegrationError extends Model {
    static init(sequelize) {
        super.init({
            id_anymarket: DataTypes.BIGINT,
            fulfillment: DataTypes.BOOLEAN,
            status_anymarket: DataTypes.STRING,
        }, {
            sequelize
          })
        }
}

module.exports = AnytobsellerIntegrationError;