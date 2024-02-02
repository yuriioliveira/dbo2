const axios = require('axios');
const AnymarketOrder = require('../models/AnymarketOrder');

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
        console.error('Erro em AnymarketUtils.js, função: getOrdersFromAnymarket: ', error.message);
        throw error;
    }
};

const anymarketValidationFindAll = async () => {
    
    try {
        const anymarketOrdersValidacao = await AnymarketOrder.findAll({
            where: {
              fulfillment: false,
              pedido_integrado_bseller: false
            },
            attributes: ['id_anymarket', 'fulfillment', 'status_anymarket']
          });

          return anymarketOrdersValidacao;

    } catch (error) {
        console.error('Erro em AnymarketUtils.js, função: anymarketValidationFindAll: ', error.message);
        throw error;
    }
}

const anymarketUpdateValidacao = async (idAnymarketUpdate, anymarketInfoUpdate) => {
    
    try {
        await AnymarketOrder.update(
            anymarketInfoUpdate,
            { where: { id_anymarket: idAnymarketUpdate } }
          );
    } catch (error) {
        console.error('Erro em AnymarketUtils.js, função: anymarketUpdateValidacao: ', error.message);
    }
    

}

module.exports = {
    getOrdersFromAnymarket,
    anymarketValidationFindAll,
    anymarketUpdateValidacao
};