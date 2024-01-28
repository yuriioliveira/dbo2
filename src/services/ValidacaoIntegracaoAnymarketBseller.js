const Anymarket = require('../models/Anymarket');
const Bseller = require('../models/Bseller');
const IntegracaoBsellerErros = require('../models/integracaoBsellerErros');

// Acho que isso precisa ser um controller e dividir as funcoes aqui no services. 

async function validacaoErrosIntegracao() {
  let bsellerIntegrados = 0;
  let bsellerNaoIntegrados = 0;
  try {
    const anymarketOrders = await Anymarket.findAll({
      where: {
        fulfillment: false,
        pedido_integrado_bseller: false
      },
      attributes: ['id_anymarket', 'fulfillment', 'status_anymarket']
    });

    for (const order of anymarketOrders) {
      try {
        const bsellerOrder = await Bseller.findOne({
          where: {
            id_anymarket: order.id_anymarket
          }
        });
        if (bsellerOrder === null) {

          const checkErroIntegracao = await IntegracaoBsellerErros.findOne({
            where: {
              id_anymarket: order.id_anymarket
            }
          });

          // incluir a validação de status cancelado, pois se o pedido na Anymarket estiver cancelado e não existir no bseller não é um problema.
          if (checkErroIntegracao === null) {
            await IntegracaoBsellerErros.create({
              id_anymarket: order.id_anymarket,
              fulfillment: order.fulfillment,
              status_anymarket: order.status_anymarket
            });
            bsellerNaoIntegrados++;
          } else {
            console.log('Pedido já cadastrado na tabela de erros')
            continue
          }
        } else {
          await Anymarket.update(
            { pedido_integrado_bseller: 'true' },
            { where: { id_anymarket: order.id_anymarket } }
          );

          await IntegracaoBsellerErros.destroy(
            { where: { id_anymarket: order.id_anymarket } },
          );
          bsellerIntegrados++;
        }
      } catch (error) {
        console.error('Erro ao processar pedido:', error);
        // Se ocorrer um erro, continue para o próximo pedido
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

// Exportar os módulos
module.exports = {
  validacaoErrosIntegracao
};