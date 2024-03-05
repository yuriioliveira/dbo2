const IntelipostErrors = require('../models/IntelipostErrors');

module.exports = {
  // método de index do banco
  async index(req, res) {
    const orders_intelipostErrors = await IntelipostErrors.findAll();

    return res.json(orders_intelipostErrors);
  },

  // método para armazenar no banco
  async store(req, res) {
    const { 
      id_anymarket,
      id_entrega
    } = req.body;

    try {
      const intelipostErrors = await IntelipostErrors.create({ 
        id_anymarket,
        id_entrega
      });
  
      return res.json(intelipostErrors);
      
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