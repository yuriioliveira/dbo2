const AnymarketOrder = require('../models/AnymarketOrder');
const BsellerOrder = require('../models/BsellerOrder');
const AnyToBsellerStatusValidation = require('../models/AnytobsellerStatusValidation');
const { Sequelize } = require('sequelize');
const AnyToBsellerStatusEquivalenceUtils = require('../utils/AnyToBsellerStatusEquivalenceUtils');

async function AnyToBsellerStatusValidationFeed() {
  let quantidadeStatusOk = 0;
  let quantidadeStatuserro = 0;

  try {
    const query = `
      SELECT a.id_anymarket, a.status_anymarket, b.id_entrega, b.status_bseller
      FROM anymarket_orders a
      JOIN bseller_orders b ON a.id_anymarket = b.id_anymarket
      WHERE a.fulfillment = false AND a.monitorar_status = true AND b.origem_pedido = 'Site'
    `;
    const getOrdersToCheckStatus = await AnymarketOrder.sequelize.query(query, {
      type: Sequelize.QueryTypes.SELECT,
      include: [BsellerOrder]
    });

    const ordersToUpdate = [];
    const ordersToCreate = [];
    const ordersToDelete = [];

    for (const order of getOrdersToCheckStatus) {
      const { status_anymarket, status_bseller, id_anymarket } = order;

      const validateStatusEquivalence = async (statusToCheckAnymarket, statusToCheckBseller) => {
        const validateReturn = await AnyToBsellerStatusEquivalenceUtils.CheckStatusEquivalence(statusToCheckAnymarket, statusToCheckBseller);
        if (validateReturn === true) {
          const checkAlreadyExist = await AnyToBsellerStatusValidation.findOne({
            where: {
              id_anymarket
            }
          });
          if (checkAlreadyExist === null) {
            quantidadeStatusOk++;
          } else {
            ordersToDelete.push(id_anymarket);
            quantidadeStatusOk++;
          }
        } else {
          ordersToCreate.push({
            id_anymarket,
            status_anymarket,
            status_bseller,
            observacoes
          });
          quantidadeStatuserro++;
        }

        if (statusToCheckAnymarket === 'CONCLUDED' && statusToCheckBseller === 'ENT') {
          ordersToUpdate.push(id_anymarket);
        } else if (statusToCheckAnymarket === 'CANCELED' && statusToCheckBseller === 'CAN') {
          ordersToUpdate.push(id_anymarket);
        }
      };

      await validateStatusEquivalence(status_anymarket, status_bseller);
    }

    if (ordersToDelete.length > 0) {
      await AnyToBsellerStatusValidation.destroy({
        where: {
          id_anymarket: ordersToDelete
        }
      });
    }

    if (ordersToCreate.length > 0) {
      await AnyToBsellerStatusValidation.bulkCreate(ordersToCreate, {
        updateOnDuplicate: ['status_anymarket', 'status_bseller'],
        conflictAttributes: ['id_anymarket']
    });
    }

    if (ordersToUpdate.length > 0) {
      await AnymarketOrder.update(
        { monitorar_status: false },
        {
          where: {
            id_anymarket: ordersToUpdate
          }
        }
      );
    }

    return { quantidadeStatusOk, quantidadeStatuserro };
  } catch (error) {
    console.error('Erro em OrdersStatusValidation.js, Erro 01: ', error);
  }
}

module.exports = {
  AnyToBsellerStatusValidationFeed
};