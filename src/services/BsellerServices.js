const axios = require('axios');

const getOrdersFrom280Bseller = async (dataInicial, dataFinal) => {
    const requestData = {
        parametros: {
          P_ID_CIA: '11422',
          DT_INICIO: dataInicial,
          DT_FIM: dataFinal,
          P_ID_FILIAL: '1',
          P_ID_ORIGEM: null,
          P_ID_SITUACAO: null,
          P_UNINEG: null
        }
      };

    try {
        const response = await axios.post('https://api-dw.bseller.com.br/webquery/execute/SIGEQ280', requestData, {
            headers: {
              'X-Auth-Token': process.env.TOKEN_BSELLER,
              'Content-Type': 'application/json'
            },
        });

        return response.data;
        
    } catch (error) {
        console.error('Erro na requisição:', error.message);
        throw error;
    }
};


module.exports = {
    getOrdersFrom280Bseller
};