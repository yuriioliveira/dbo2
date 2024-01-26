const axios = require('axios');

const getOrdersFromAnymarket = async (dataInicial, dataFinal, offsetAtual) => {
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

module.exports = {
    getOrdersFromAnymarket,
};