const GeralOrder = require('../models/GeralOrder');

module.exports = {
  // método de index do banco
  async index(req, res) {
    const geralOrders = await GeralOrder.findAll();

    return res.json(geralOrders);
  },

  // método para armazenar no banco
  async store(req, res) {
    const { 
        id_entrega,
        id_anymarket_core,
        id_marketplace,
        valor_total,
        valor_frete,
        data_pedido,
        forma_pagamento,
        data_aprovacao_pagamento,
        status,
        status_data,
        nome_marketplace,
        transportadora,
        origem_pedido,
        fulfillment,
        custo_frete_fulfillment,
        cliente_nome,
        cliente_cpfcnpj,
        cliente_uf,
        cliente_cidade,
        cliente_bairro,
        nfe_chave,
        nfe_numero,
        nfe_serie,
        nfe_data,
        produtos,
        id_filial,
        despesas_financeiras,
        unidade_negocio,
        usuário_inclusao,
        id_canal
    } = req.body;

    try {
      const geralOrder = await GeralOrder.create({ 
        id_entrega,
        id_anymarket_core,
        id_marketplace,
        valor_total,
        valor_frete,
        data_pedido,
        forma_pagamento,
        data_aprovacao_pagamento,
        status,
        status_data,
        nome_marketplace,
        transportadora,
        origem_pedido,
        fulfillment,
        custo_frete_fulfillment,
        cliente_nome,
        cliente_cpfcnpj,
        cliente_uf,
        cliente_cidade,
        cliente_bairro,
        nfe_chave,
        nfe_numero,
        nfe_serie,
        nfe_data,
        produtos,
        id_filial,
        despesas_financeiras,
        unidade_negocio,
        usuário_inclusao,
        id_canal
      });
  
      return res.json(geralOrder);
      
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        // Verifica se o erro é devido a uma restrição única (ID já existe)
        return res.status(400).json({ error: 'id_anymarket já existe.' });
      }

      // Caso contrário, trata outros erros
      console.error(error);
      return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  }
};