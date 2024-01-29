const IntegracaoBsellerErros = require('../models/integracaoBsellerErros');
const AnymarketUtils = require('../utils/AnymarketUtils');
const BsellerUtils = require('../utils/BsellerUtils');
const IntegracaoBsellerErrosUtils = require('../utils/IntegracaoBsellerErrosUtils');

async function OrdersValidationAnyToBseller() {
  let bsellerIntegrados = 0;
  let bsellerNaoIntegrados = 0;

  try {
    const anymarketOrders = await AnymarketUtils.anymarketValidationFindAll();

    for (const order of anymarketOrders) {
      try {
        let findParametersBseller = {
          "id_anymarket": order.id_anymarket
        }
        const bsellerOrder = await BsellerUtils.bsellerFindOne(findParametersBseller);

        if (bsellerOrder === null) {
          let findParametersIntegracaoErros = {
            "id_anymarket": order.id_anymarket
          }
          const checkErroIntegracao = await IntegracaoBsellerErrosUtils.integracaoErrosFindOne(findParametersIntegracaoErros);

          if (checkErroIntegracao === null && order.status_anymarket !== 'CANCELED') {
            await IntegracaoBsellerErros.create({
              id_anymarket: order.id_anymarket,
              fulfillment: order.fulfillment,
              status_anymarket: order.status_anymarket
            });
            bsellerNaoIntegrados++;
          } else {
            let = idAnymarketUpdate = order.id_anymarket
            await AnymarketUtils.anymarketUpdateValidacao(idAnymarketUpdate)
            continue
          }
        } else {
          let idAnymarketUpdate = order.id_anymarket
          await AnymarketUtils.anymarketUpdateValidacao(idAnymarketUpdate)

          let findParametersIntegracaoErros = {
            "id_anymarket": order.id_anymarket
          }
            await IntegracaoBsellerErrosUtils.integracaoErrosDestroy(findParametersIntegracaoErros);
            
          bsellerIntegrados++;
        }
      } catch (error) {
        console.error('Erro em OrdersValidationAnyToBseller.js, Erro 01: ', error);
        continue;
      }
    }
  } catch (error) {
    console.error('Erro em OrdersValidationAnyToBseller.js, Erro 02: ', error);
  }

  return {
    bsellerIntegrados,
    bsellerNaoIntegrados
  };
}

module.exports = {
  OrdersValidationAnyToBseller
};