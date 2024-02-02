const { Model, DataTypes } = require('sequelize');

class BsellertointelipostStatusValidation extends Model {
    static init(sequelize) {
        super.init({
            id_anymarket: DataTypes.BIGINT,
            id_entrega: DataTypes.BIGINT,
            status_bseller: DataTypes.STRING,
            status_intelipost: DataTypes.STRING, 
            status_anymarket: DataTypes.STRING
        }, {
            sequelize
          })
        }
}

module.exports = BsellertointelipostStatusValidation;