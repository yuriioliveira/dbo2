const Anymarket = require('../models/Anymarket');
const Bseller = require('../models/Bseller');
const Intelipost = require('../models/Intelipost');
const { Sequelize, literal } = require('sequelize');

// continuar a implementar a query, compor o envio dos dados para a tabela Intelipost e colocar um if para caso o pedido já exista lá não vir na consulta inicial. 
// implementar para fazer o update na Anymarket para não trazer o pedido novamente. 

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
        id_marketplace: order.id_marketplace,
        status_anymarket: order.status_anymarket,
        status_bseller: order.status_bseller,
        status_marketplace: order.status_marketplace,
        status_intelipost:"",
        nota_fiscal_anymarket: {
          "chave_nf": order.chave_nf,
          "numero_nf_": order.numero_nf,
          "serie_nf": order.serie_nf,
          "data_nf": order.data_nf,
        },
        nota_fiscal_intelipost: {
          "chave_nf": "",
          "numero_nf": "",
          "serie_nf": "",
          "data_nf": ""
        }
      })
    }
    console.log(ordersIntelipost)
    const result = await Intelipost.bulkCreate(ordersIntelipost, {
      updateOnDuplicate: ['status_anymarket', 'status_bseller', 'status_marketplace', 'nota_fiscal_anymarket'],
      conflictAttributes: ['id_anymarket']
    })

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