const axios = require('axios');
const IntelipostOrder = require('../models/IntelipostOrder');


const intelipostFindOne = async (findParametersIntelipost) => {
    try {
        const returnIntelipostFindOne = await IntelipostOrder.findOne({
          where: 
          findParametersIntelipost
          })
  
          return returnIntelipostFindOne;
  
    } catch (error) {
        console.error('Erro em intelipostUtils.js, função: intelipostFindOne: ', error.message);
        throw error;
    }
  }

  const intelipostFindAll = async (findParametersIntelipost) => {
    try {
        const returnIntelipostFindOne = await IntelipostOrder.findAll({
          where: 
          findParametersIntelipost
          })
  
          return returnIntelipostFindOne;
  
    } catch (error) {
        console.error('Erro em intelipostUtils.js, função: intelipostFindAll: ', error.message);
        throw error;
    }
  }

  const intelipostUpdate = async (idAnymarketUpdate, intelipostInfoUpdate) => {
    
    try {
        await IntelipostOrder.update(
          intelipostInfoUpdate,
            { where: { id_anymarket: idAnymarketUpdate } }
          );
    } catch (error) {
        console.error('Erro em intelipostUtils.js, função: intelipostUpdate: ', error.message);
    }
}

  const intelipostGetOrdersData = async (idEntrega) => {

    try {
      const response = await axios.get(`https://api.intelipost.com.br/api/v1/shipment_order/${idEntrega}`, {
        headers: {
          'api-key': process.env.TOKEN_INTELIPOST,
      }
      });
      return response.data;
      
    } catch (error) {
      console.log(idEntrega)
        if (error.response && error.response.status === 400) {
          return { pedido: 'não encontrado'};
          };
        }
      console.error('Erro em InteliposttUtils.js, função: intelipostGetOrdersData: ', error.message);
        throw error;
    }
  

  
  module.exports = {
    intelipostFindOne,
    intelipostFindAll,
    intelipostGetOrdersData,
    intelipostUpdate
};