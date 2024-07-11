const { Model, DataTypes } = require('sequelize');

class CoreOrder extends Model {
    static init(sequelize) {
        super.init({
            id_core: DataTypes.BIGINT,
            status_core: DataTypes.STRING,
        }, {
            sequelize
          })
        }
    }

module.exports = CoreOrder;