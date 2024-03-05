const { Model, DataTypes } = require('sequelize');

class GeralOrder extends Model {
    static init(sequelize) {
        super.init({
            id_entrega: DataTypes.BIGINT,
            id_anymarket_core: DataTypes.BIGINT,
            id_marketplace: DataTypes.STRING,
            valor_total: DataTypes.DECIMAL,
            valor_frete: DataTypes.DECIMAL,
            data_pedido: DataTypes.STRING,
            forma_pagamento: DataTypes.STRING,
            data_aprovacao_pagamento: DataTypes.STRING,
            status: DataTypes.STRING,
            status_data: DataTypes.STRING,
            nome_marketplace: DataTypes.STRING,
            transportadora: DataTypes.STRING,
            origem_pedido: DataTypes.STRING,
            fulfillment: DataTypes.BOOLEAN,
            custo_frete_fulfillment: DataTypes.DECIMAL,
            cliente_nome: DataTypes.STRING,
            cliente_cpfcnpj: DataTypes.STRING,
            cliente_uf: DataTypes.STRING,
            cliente_cidade: DataTypes.STRING,
            cliente_bairro: DataTypes.STRING,
            nfe_chave: DataTypes.STRING,
            nfe_numero: DataTypes.STRING,
            nfe_serie: DataTypes.STRING,
            nfe_data: DataTypes.STRING,
            produtos: DataTypes.JSONB,
            id_filial: DataTypes.STRING,
            despesas_financeiras: DataTypes.DECIMAL,
            unidade_negocio: DataTypes.STRING,
            usuário_inclusao: DataTypes.STRING,
            id_canal: DataTypes.STRING,
        }, {
            sequelize
          })
        }
    }

module.exports = GeralOrder;