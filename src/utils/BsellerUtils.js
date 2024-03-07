const axios = require('axios');
const BsellerOrder = require('../models/BsellerOrder');

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
        console.error('Erro em BsellerUtils.js, função: getOrdersFrom280Bseller: ', error.message);
        throw error;
    }
};

const getDataFrom230Bseller = async () => {

  const requestData = {
      parametros: {
        P_DT_INCL_INI: null,
        P_DT_INCL_FIM: null,
        P_ID_CIA: "11422",
        P_ID_CONI: null,
        P_ID_DEPART: null,
        P_ID_FORNEC: null
      }
    };

  try {
      const response = await axios.post('https://api-dw.bseller.com.br/webquery/execute/SIGEQ230', requestData, {
          headers: {
            'X-Auth-Token': process.env.TOKEN_BSELLER,
            'Content-Type': 'application/json'
          },
      });

      return response.data;
      
  } catch (error) {
      console.error('Erro em BsellerUtils.js, função: getDataFrom230Bseller: ', error.message);
      throw error;
  }
};


const bsellerFindOne = async (findParametersBseller) => {
  try {
      const returnBsellerFindOne = await BsellerOrder.findOne({
        where: 
        findParametersBseller
        })

        return returnBsellerFindOne;

  } catch (error) {
      console.error('Erro em BsellerUtils.js, função: bsellerFindOne: ', error.message);
      throw error;
  }
}

const getInvoiceFromBseller = async (dataInicial, dataFinal) => {
  const requestData = {
    "parametros": {
      "P_ID_CIA": "11422",
      "P_ID_FILIAL": 1,
      "P_DT_INI": dataInicial,
      "P_DT_FIM": dataFinal,
      "P_IN_ES": null,
      "P_IN_SIT": null,
      "P_CFOP": null
  }
    };

  try {
      const response = await axios.post('https://api-dw.bseller.com.br/webquery/execute/SIGEQ880', requestData, {
          headers: {
            'X-Auth-Token': process.env.TOKEN_BSELLER,
            'Content-Type': 'application/json'
          },
      });

      return response.data;
      
  } catch (error) {
      console.error('Erro em BsellerUtils.js, função: getOrdersFrom280Bseller: ', error.message);
      throw error;
  }
};

const bsellerAjusteData = async (dataBseller, horarioBseller) => {
  
  let [day, month, year] = dataBseller.split("/");
  let formattedDate = `${year}-${month}-${day}`;
  let dataHorario = new Date(`${formattedDate}T${horarioBseller}:00Z`);

  return dataHorario;
}

module.exports = {
    getOrdersFrom280Bseller,
    getDataFrom230Bseller,
    bsellerFindOne,
    getInvoiceFromBseller,
    bsellerAjusteData
};