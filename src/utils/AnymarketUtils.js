const axios = require('axios');
const AnymarketOrder = require('../models/AnymarketOrder');

const getOrdersFromAnymarket = async (dataInicial, dataFinal, marketplaceName, offsetAtual, registrosTotal) => {
    // tratar o erro 429, para dar um timeout e tentar novamente
    let urlAny;

    if (marketplaceName === 'todos') {
        urlAny = `http://api.anymarket.com.br/v2/orders?createdAfter=${dataInicial}T00:00:00-03:00&createdBefore=${dataFinal}T23:59:59-03:00&limit=100&offset=${offsetAtual}`;
    } else { 
        urlAny = `http://api.anymarket.com.br/v2/orders?createdAfter=${dataInicial}T00:00:00-03:00&createdBefore=${dataFinal}T23:59:59-03:00&limit=100&offset=${offsetAtual}&marketplace=${marketplaceName}`;
    }
    
    try {
        let urlRequest = urlAny;
        console.log('urlRequest: ', urlRequest);
        console.log('offset: ', offsetAtual)
        console.log('registrosTotal: ', registrosTotal)
        const response = await axios.get(urlRequest, {
            headers: {
                'gumgaToken': process.env.TOKEN_ANYMARKET,
                'Content-Type': 'application/json'
            }
        });

        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 429) {
            console.error('Erro 429 em AnymarketUtils.js, função: getOrdersFromAnymarket. Tentando novamente em 30 segundos.');
            await new Promise(resolve => setTimeout(resolve, 30000)); // Espera 30 segundos
            console.log('Tentando novamente...')
            return getOrdersFromAnymarket(dataInicial, dataFinal, offsetAtual); // Tenta novamente
        } else {
            console.error('Erro em AnymarketUtils.js, função: getOrdersFromAnymarket: ', error.message);
            throw error;
        }
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