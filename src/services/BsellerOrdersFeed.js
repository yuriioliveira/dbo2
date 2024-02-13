const BsellerUtils = require('../utils/BsellerUtils');
const BsellerOrder = require('../models/BsellerOrder');

const BsellerOrdersFeed = async () => {
  let dataInicial = '01/02/2024';
  let dataFinal = '13/02/2024';
  let registrosProcessados = 0;
  let registrosTotal = 0;

  try {
    const conteudo = await BsellerUtils.getOrdersFrom280Bseller(
      dataInicial,
      dataFinal
    );
    const orders_bseller = [];

    for (const order of conteudo) {
      const existingOrder = orders_bseller.find(
        (o) => o.id_anymarket === order.PEDC_PED_CLIENTE
      );
      if (!existingOrder) {
        orders_bseller.push({
          id_anymarket: order.PEDC_PED_CLIENTE,
          id_entrega: order.PEDC_ID_PEDIDO,
          status_bseller: order.SREF_ID_PONTO_ULT,
          data_pedido: order.PEDC_DT_EMISSAO,
          chave_nf: '',
          numero_nf: '',
          serie_nf: '',
          data_nf: '',
          pedido_integrado_intelipost: false,
          app_pagamento_aprovado: false,
          app_data_aprovacao_pagamento: '',
          origem_pedido: order.ID_ORIGEM,
          descricao_status: '',
        });
      }
    }

    const result = await BsellerOrder.bulkCreate(orders_bseller, {
      updateOnDuplicate: ['id_entrega', 'status_bseller', 'origem_pedido'],
      conflictAttributes: ['id_entrega'],
    });

    registrosProcessados += result.length;
    registrosTotal = conteudo.length;
  } catch (error) {
    console.error('Erro na requisição: AQUI', error.message);
  }

  return {
    registrosProcessados,
    registrosTotal,
  };
};

module.exports = {
  BsellerOrdersFeed,
};
