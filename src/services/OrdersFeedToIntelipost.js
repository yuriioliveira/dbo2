const Anymarket = require('../models/Anymarket');
const Bseller = require('../models/Bseller');
const Intelipost = require('../models/Intelipost');
const { Sequelize } = require('sequelize');
const AnymarketUtils = require('../utils/AnymarketUtils');
const IntelipostUtils = require('../utils/IntelipostUtils');

async function getOrdersIntelipost() {

  let registrosProcessados = 0;
  let registrosTotal = 0;
  try {
    const query = `
    SELECT a.id_anymarket, b.id_entrega, a.id_marketplace, a.status_anymarket, b.status_bseller, a.status_marketplace, a.chave_nf, a.numero_nf, a.serie_nf, a.data_nf
    FROM anymarkets a
    JOIN bsellers b ON a.id_anymarket = b.id_anymarket
    WHERE a.marketplace_nome = 'SHOPEE' AND a.pedido_integrado_intelipost = false;
    `;

    const ordersToIntelipost = await Anymarket.sequelize.query(query, {
      type: Sequelize.QueryTypes.SELECT,
      include: [Bseller]
    });

    const ordersIntelipost = []
    for (const order of ordersToIntelipost) {
      ordersIntelipost.push({
        id_anymarket: order.id_anymarket,
        id_entrega: order.id_entrega,
        status_intelipost:'',
        chave_nf: "",
        numero_nf: "",
        serie_nf: "",
        data_nf: ""
      })
    }

    const result = await Intelipost.bulkCreate(ordersIntelipost, {
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
  getOrdersIntelipost
};