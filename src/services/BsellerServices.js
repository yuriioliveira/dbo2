const axios = require('axios');

const getOrdersFromBseller = async (dataInicial, dataFinal, uniNeg, i ) => {
    try {
        const response = await axios.get(`http://api.bseller.com.br/pedidos/aprovados?dataInicial=${dataInicial}&dataFinal=${dataFinal}&unidadeNegocio=${uniNeg[i]}&page=0&limit=500`, {
            headers: {
                'X-Auth-Token': process.env.TOKEN_BSELLER,
                'Content-Type': 'application/json'
            }
        });
        
        return response.data;
    } catch (error) {
        console.error('Erro na requisição:', error.message);
        throw error;
    }
};

module.exports = {
    getOrdersFromBseller,
};