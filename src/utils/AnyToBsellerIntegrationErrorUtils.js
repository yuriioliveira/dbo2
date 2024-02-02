const AnytobsellerIntegrationError = require('../models/AnytobsellerIntegrationError');

const integracaoErrosFindOne = async (findParametersIntegracaoErros) => {
    try {
        const returnIntegracaoErrosFindOne = await AnytobsellerIntegrationError.findOne({
          where: 
          findParametersIntegracaoErros
          })
  
          return returnIntegracaoErrosFindOne;
  
    } catch (error) {
        console.error('Erro em AnyToBsellerIntegrationErrorUtils.js, função: integracaoErrosFindOne: ', error.message);
        throw error;
    }
  }

  const integracaoErrosDestroy = async (findParametersIntegracaoErros) => {
    try {
        await AnytobsellerIntegrationError.destroy(
            { where:
              findParametersIntegracaoErros 
            });
  
          return ("id removido com sucesso")
  
    } catch (error) {
        console.error('Erro em AnyToBsellerIntegrationErrorUtils.js, função: integracaoErrosDestroy: ', error.message);
        throw error;
    }
  }

module.exports = {
    integracaoErrosFindOne,
    integracaoErrosDestroy
    };
