const AnyToBsellerStatusValidation = require('../models/AnytobsellerStatusValidation');

//  controller para puxar e criar registros na tabela StatusValidation

module.exports = {
  // método de index do banco
  async index(req, res) {
    const ordersStatusValidation = await AnyToBsellerStatusValidation.findAll();

    return res.json(ordersStatusValidation);
  },

  // método para armazenar no banco
  async store(req, res) {
    const { 
        id_anymarket,
        id_entrega,
        status_anymarket,
        status_bseller,
        chave_nf,
        numero_nf,
        serie_nf,
        observacoes
    } = req.body;

    try {
      const ordersStatusValidationStore = await AnyToBsellerStatusValidation.create({ 
        id_anymarket,
        id_entrega,
        status_anymarket,
        status_bseller,
        chave_nf,
        numero_nf,
        serie_nf,
        observacoes
      });
  
      return res.json(ordersStatusValidationStore);
      
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