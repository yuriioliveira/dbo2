// ZERAR O BANCO E TESTAR NOVAMENTE FORCANDO ERRO DE INTEGRAÇÃO

const AnytobsellerIntegrationError = require('../models/AnytobsellerIntegrationError');
const AnymarketUtils = require('../utils/AnymarketUtils');
const BsellerUtils = require('../utils/BsellerUtils');
const AnyToBsellerIntegrationErrorUtils = require('../utils/AnyToBsellerIntegrationErrorUtils');

async function AnyToBsellerIntegrationErrorFeed() {
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
          const checkErroIntegracao = await AnyToBsellerIntegrationErrorUtils.integracaoErrosFindOne(findParametersIntegracaoErros);

          if (checkErroIntegracao === null && order.status_anymarket !== 'CANCELED') {
            await AnytobsellerIntegrationError.create({
              id_anymarket: order.id_anymarket,
              fulfillment: order.fulfillment,
              status_anymarket: order.status_anymarket
            });
            bsellerNaoIntegrados++;
          } else {
            continue
          }
        } else {
          let idAnymarketUpdate = order.id_anymarket
          let anymarketInfoUpdate = { pedido_integrado_bseller: 'true' };

          await AnymarketUtils.anymarketUpdateValidacao(idAnymarketUpdate, anymarketInfoUpdate)

          let findParametersIntegracaoErros = {
            "id_anymarket": order.id_anymarket
          }
            await AnytobsellerIntegrationError.destroy(
              { where:
                findParametersIntegracaoErros 
              });
            
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
  AnyToBsellerIntegrationErrorFeed
};