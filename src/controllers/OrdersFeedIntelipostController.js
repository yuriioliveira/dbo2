const Anymarket = require('../models/Anymarket');
const Bseller = require('../models/Bseller');

async function getShopeeOrders(req, res) {
  try {
    const anymarketOrdersShopee = await Anymarket.findAll({
      where: {
        marketplace_nome: 'SHOPEE',
        status_anymarket: ['PAID_WAITING_SHIP', 'INVOICED', 'CONCLUDED', 'PAID_WAITING_DELIVERY']
      },
      attributes: ['id_anymarket', 'marketplace_nome']
    });

    const validOrders = [];
    for (const anymarket of anymarketOrdersShopee) {
      const bseller = await Bseller.findOne({
        where: {
          id_anymarket: anymarket.id_anymarket
        }
      });
      if (bseller !== null) {
        const orderWithBsellersInfo = {
          id_anymarket: anymarket.id_anymarket,
          marketplace_nome: anymarket.marketplace_nome,
          id_entrega: bseller.id_entrega,
          status_bseller: bseller.status_bseller
        };
        validOrders.push(orderWithBsellersInfo);
      }
    }

    return res.json(validOrders);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  getShopeeOrders
};