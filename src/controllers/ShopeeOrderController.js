const ShopeeOrder = require('../models/ShopeeOrder');

module.exports = {
  // método de index do banco
  async index(req, res) {
    const orders_shopee = await ShopeeOrder.findAll();

    return res.json(orders_shopee);
  },

  // método para armazenar no banco
  async store(req, res) {
    const { 
        id_anymarket,
        id_entrega,
        id_marketplace,
        status_anymarket,
        status_bseller,
        status_marketplace,
        data_pedido,
        chave_nf_any,
        numero_nf_any,
        serie_nf_any,
        data_nf_any,
        chave_nf_bseller,
        numero_nf_bseller,
        serie_nf_bseller,
        data_nf_bseller,
        valor_total,
    } = req.body;

    try {
      const shopee = await ShopeeOrder.create({ 
        id_anymarket,
        id_entrega,
        id_marketplace,
        status_anymarket,
        status_bseller,
        status_marketplace,
        data_pedido,
        chave_nf_any,
        numero_nf_any,
        serie_nf_any,
        data_nf_any,
        chave_nf_bseller,
        numero_nf_bseller,
        serie_nf_bseller,
        data_nf_bseller,
        valor_total,
      });
  
      return res.json(shopee);
      
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