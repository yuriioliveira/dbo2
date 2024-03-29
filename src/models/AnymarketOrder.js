const { Model, DataTypes } = require('sequelize');

class AnymarketOrder extends Model {
    static init(sequelize) {
        super.init({
            id_anymarket: DataTypes.BIGINT,
            id_marketplace: DataTypes.STRING,
            status_anymarket: DataTypes.STRING,
            status_marketplace: DataTypes.STRING,
            marketplace_nome: DataTypes.STRING,
            fulfillment: DataTypes.BOOLEAN,
            chave_nf: DataTypes.STRING,
            numero_nf: DataTypes.STRING,
            serie_nf: DataTypes.STRING,
            data_nf: DataTypes.STRING,
            valor_total: DataTypes.DECIMAL,
            data_pedido: DataTypes.STRING,
            nome_cliente: DataTypes.STRING,
            documento_cliente: DataTypes.STRING,
            tipo_documento_cliente: DataTypes.STRING,
            pedido_integrado_bseller: DataTypes.BOOLEAN,
            pedido_integrado_intelipost: DataTypes.BOOLEAN,
            monitorar_status: DataTypes.BOOLEAN,
            app_nf_atualizada: DataTypes.BOOLEAN,
            app_data_nf_atualizada: DataTypes.STRING,
            app_status_pedido_atualizado: DataTypes.BOOLEAN,
            app_data_status_pedido_atualizado: DataTypes.STRING,
            app_faturamento_atrasado: DataTypes.BOOLEAN,
            app_data_faturamento_atrasado: DataTypes.STRING,
        }, {
            sequelize
          })
        }
    }

module.exports = AnymarketOrder;