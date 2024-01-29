const IntegracaoBsellerErros = require('../models/integracaoBsellerErros');
const AnymarketService = require('../services/AnymarketServices');
const BsellerService = require('../services/BsellerServices');
const IntegracaoBsellerErrosServices = require('../services/IntegracaoBsellerErrosServices');

// mudar realmente para controller? 

async function validacaoErrosIntegracao() {
  let bsellerIntegrados = 0;
  let bsellerNaoIntegrados = 0;

  try {
    const anymarketOrders = await AnymarketService.anymarketValidationFindAll();

    for (const order of anymarketOrders) {
      try {
        let findParametersBseller = {
          "id_anymarket": order.id_anymarket
        }
        const bsellerOrder = await BsellerService.bsellerFindOne(findParametersBseller);

        if (bsellerOrder === null) {
          let findParametersIntegracaoErros = {
            "id_anymarket": order.id_anymarket
          }
          const checkErroIntegracao = await IntegracaoBsellerErrosServices.integracaoErrosFindOne(findParametersIntegracaoErros);

          if (checkErroIntegracao === null && order.status_anymarket !== 'CANCELED') {
            await IntegracaoBsellerErros.create({
              id_anymarket: order.id_anymarket,
              fulfillment: order.fulfillment,
              status_anymarket: order.status_anymarket
            });
            bsellerNaoIntegrados++;
          } else {
            let = idAnymarketUpdate = order.id_anymarket
            await AnymarketService.anymarketUpdateValidacao(idAnymarketUpdate)
            continue
          }
        } else {
          let idAnymarketUpdate = order.id_anymarket
          await AnymarketService.anymarketUpdateValidacao(idAnymarketUpdate)

          let findParametersIntegracaoErros = {
            "id_anymarket": order.id_anymarket
          }
          await IntegracaoBsellerErrosServices.integracaoErrosDestroy(findParametersIntegracaoErros);

          bsellerIntegrados++;
        }
      } catch (error) {
        console.error('Erro ao processar pedido:', error);
        continue;
      }
    }
  } catch (error) {
    console.error('Erro ao obter os pedidos da Anymarket:', error);
  }

  return {
    bsellerIntegrados,
    bsellerNaoIntegrados
  };
}

module.exports = {
  validacaoErrosIntegracao
};