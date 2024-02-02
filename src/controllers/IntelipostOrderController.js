const IntelipostOrder = require('../models/IntelipostOrder');

module.exports = {
  // método de index do banco
  async index(req, res) {
    const orders_bseller = await IntelipostOrder.findAll();

    return res.json(orders_bseller);
  },

  // método para armazenar no banco
  async store(req, res) {
    const { 
      id_anymarket,
      id_entrega,
      status_intelipost,
      chave_nf,
      numero_nf,
      serie_nf,
      data_nf,
      monitorar_status
    } = req.body;

    try {
      const bseller = await IntelipostOrder.create({ 
        id_anymarket,
        id_entrega,
        status_intelipost,
        chave_nf,
        numero_nf,
        serie_nf,
        data_nf,
        monitorar_status
      });
  
      return res.json(bseller);
      
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        // Verifica se o erro é devido a uma restrição única (ID já existe)
        return res.status(400).json({ error: 'id_entrega já existe.' });
      }

      // Caso contrário, trata outros erros
      console.error(error);
      return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  }
};