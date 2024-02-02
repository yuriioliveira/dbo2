const AnymarketOrder = require('../models/AnymarketOrder');
const BsellerOrder = require('../models/BsellerOrder');
const IntelipostOrder = require('../models/IntelipostOrder');
const { Sequelize } = require('sequelize');
const AnymarketUtils = require('../utils/AnymarketUtils');
const IntelipostUtils = require('../utils/IntelipostUtils');

async function IntelipostOrdersFeed() {

  let registrosProcessados = 0;
  let registrosTotal = 0;

  try {
    const query = `
    SELECT a.id_anymarket, b.id_entrega, a.id_marketplace, a.status_anymarket, b.status_bseller, a.status_marketplace, a.chave_nf, a.numero_nf, a.serie_nf, a.data_nf
    FROM anymarket_orders a
    JOIN bseller_orders b ON a.id_anymarket = b.id_anymarket
    WHERE a.marketplace_nome = 'SHOPEE' AND a.pedido_integrado_intelipost = false;
    `;

    const ordersToIntelipost = await AnymarketOrder.sequelize.query(query, {
      type: Sequelize.QueryTypes.SELECT,
      include: [BsellerOrder]
    });

    const ordersIntelipost = []
    for (const order of ordersToIntelipost) {
      ordersIntelipost.push({
        id_anymarket: order.id_anymarket,
        id_entrega: order.id_entrega,
        status_intelipost: null,
        chave_nf: "",
        numero_nf: "",
        serie_nf: "",
        data_nf: "",
        monitorar_status: true
      })
    }

    const result = await IntelipostOrder.bulkCreate(ordersIntelipost, {
      updateOnDuplicate: ['id_anymarket', 'id_entrega'],
      conflictAttributes: ['id_anymarket']
    })

    for (const item of ordersIntelipost) {
      let findParametersIntelipost = {
        "id_anymarket": item.id_anymarket
      }
      const intelipostOrder = await IntelipostUtils.intelipostFindOne(findParametersIntelipost);

      if (intelipostOrder !== null) {
        let idAnymarketUpdate = item.id_anymarket
        let = anymarketUpdateValidacao = { pedido_integrado_intelipost: 'true' };
        await AnymarketUtils.anymarketUpdateValidacao(idAnymarketUpdate, anymarketUpdateValidacao)
      }
    }

    registrosProcessados += result.length;
    registrosTotal = ordersToIntelipost.length
  } catch (error) {
    console.error('Erro na requisição OrdersFeedToIntelipost:', error.message);
  }
  return {
    registrosProcessados,
    registrosTotal
  };
}

module.exports = {
  IntelipostOrdersFeed
};