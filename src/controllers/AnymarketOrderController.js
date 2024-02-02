const AnymarketOrder = require('../models/AnymarketOrder');

module.exports = {
  // método de index do banco
  async index(req, res) {
    const orders_anymarket = await AnymarketOrder.findAll();

    return res.json(orders_anymarket);
  },

  // método para armazenar no banco
  async store(req, res) {
    const { 
      id_anymarket,
      id_marketplace,
      status_anymarket,
      status_marketplace,
      marketplace_nome,
      fulfillment,
      chave_nf,
      numero_nf,
      serie_nf,
      data_nf,
      valor_total,
      data_pedido,
      nome_cliente,
      documento_cliente,
      tipo_documento_cliente,
      pedido_integrado_bseller,
      pedido_integrado_intelipost,
      monitorar_status,
      app_nf_atualizada,
      app_data_nf_atualizada,
      app_status_pedido_atualizado,
      app_data_status_pedido_atualizado,
      app_faturamento_atrasado,
      app_data_faturamento_atrasado
    } = req.body;

    try {
      const anymarket = await AnymarketOrder.create({ 
        id_anymarket,
        id_marketplace,
        status_anymarket,
        status_marketplace,
        marketplace_nome,
        fulfillment,
        chave_nf,
        numero_nf,
        serie_nf,
        data_nf,
        valor_total,
        data_pedido,
        nome_cliente,
        documento_cliente,
        tipo_documento_cliente,
        pedido_integrado_bseller,
        pedido_integrado_intelipost,
        monitorar_status,
        app_nf_atualizada,
        app_data_nf_atualizada,
        app_status_pedido_atualizado,
        app_data_status_pedido_atualizado,
        app_faturamento_atrasado,
        app_data_faturamento_atrasado
      });
  
      return res.json(anymarket);
      
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