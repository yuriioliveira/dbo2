const CoreOrder = require('../models/CoreOrder');

module.exports = {
    // método de index do banco
    async index(req, res) {
        const orders_core = await CoreOrder.findAll();

        return res.json(orders_core);
    },

    // método para armazenar no banco
    async store(req, res) {
        const {
            id_core,
            status_core
        } = req.body;

        try {
            const core = await CoreOrder.create({
                id_core,
                status_core
            });

            return res.json(core);

        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                // Verifica se o erro é devido a uma restrição única (ID já existe)
                return res.status(400).json({ error: 'id_core já existe.' });
            }

            // Caso contrário, trata outros erros
            console.error(error);
            return res.status(500).json({ error: 'Erro interno do servidor.' });
        }
    }
};