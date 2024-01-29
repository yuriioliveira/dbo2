const IntegracaoBsellerErros = require('../models/integracaoBsellerErros');


const integracaoErrosFindOne = async (findParametersIntegracaoErros) => {
    try {
        const returnIntegracaoErrosFindOne = await IntegracaoBsellerErros.findOne({
          where: 
          findParametersIntegracaoErros
          })
  
          return returnIntegracaoErrosFindOne;
  
    } catch (error) {
        console.error('Erro em IntegracaoBsellerErrosUtils.js, função: integracaoErrosFindOne: ', error.message);
        throw error;
    }
  }

  const integracaoErrosDestroy = async (findParametersIntegracaoErros) => {
    try {
        await IntegracaoBsellerErros.destroy(
            { where:
              findParametersIntegracaoErros 
            });
  
          return ("id removido com sucesso")
  
    } catch (error) {
        console.error('Erro em IntegracaoBsellerErrosUtils.js, função: integracaoErrosDestroy: ', error.message);
        throw error;
    }
  }

module.exports = {
    integracaoErrosFindOne,
    integracaoErrosDestroy
    };
