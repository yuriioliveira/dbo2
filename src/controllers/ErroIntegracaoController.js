const IntegracaoBsellerErros = require('../models/integracaoBsellerErros');

//  controller para puxar e criar registros na tabela integracao_bseller_erros

module.exports = {
  // método de index do banco
  async index(req, res) {
    const ordersErroIntegracao = await IntegracaoBsellerErros.findAll();

    return res.json(ordersErroIntegracao);
  },

  // método para armazenar no banco
  async store(req, res) {
    const { 
        id_anymarket,
        fulfillment,
        status_anymarket,
    } = req.body;

    try {
      const errosIntegracao = await IntegracaoBsellerErros.create({ 
        id_anymarket,
        fulfillment,
        status_anymarket,
      });
  
      return res.json(errosIntegracao);
      
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