const axios = require('axios');
const Anymarket = require('../models/Anymarket');

const getOrdersFromAnymarket = async (dataInicial, dataFinal, offsetAtual) => {
    // tratar o erro 429, para dar um timeout e tentar novamente
    try {
        const response = await axios.get(`http://api.anymarket.com.br/v2/orders?createdAfter=${dataInicial}T00:00:00-03:00&createdBefore=${dataFinal}T23:59:59-03:00&limit=100&offset=${offsetAtual}`, {
            headers: {
                'gumgaToken': process.env.TOKEN_ANYMARKET,
                'Content-Type': 'application/json'
            }
        });

        return response.data;
    } catch (error) {
        console.error('Erro na requisição:', error.message);
        throw error;
    }
};

const anymarketValidationFindAll = async () => {
    
    try {
        const anymarketOrdersValidacao = await Anymarket.findAll({
            where: {
              fulfillment: false,
              pedido_integrado_bseller: false
            },
            attributes: ['id_anymarket', 'fulfillment', 'status_anymarket']
          });

          return anymarketOrdersValidacao;

    } catch (error) {
        console.error('Erro ao obter os pedidos: ', error.message);
        throw error;
    }
}

const anymarketUpdateValidacao = async (idAnymarketUpdate) => {
    
    await Anymarket.update(
        { pedido_integrado_bseller: 'true' },
        { where: { id_anymarket: idAnymarketUpdate } }
      );

}

module.exports = {
    getOrdersFromAnymarket,
    anymarketValidationFindAll,
    anymarketUpdateValidacao
};