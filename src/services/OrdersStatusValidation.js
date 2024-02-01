const Anymarket = require('../models/Anymarket');
const Bseller = require('../models/Bseller');
const StatusValidation = require('../models/StatusValidation');
const { Sequelize } = require('sequelize');
const StatusEquivalence = require('../utils/StatusEquivalence');

async function OrdersStatusValidation() {
  let quantidadeStatusOk = 0;
  let quantidadeStatuserro = 0;

  try {
    const query = `
      SELECT a.id_anymarket, a.status_anymarket, b.id_entrega, b.status_bseller
      FROM anymarkets a
      JOIN bsellers b ON a.id_anymarket = b.id_anymarket
      WHERE a.fulfillment = false AND a.monitorar_status = true
    `;
    const getOrdersToCheckStatus = await Anymarket.sequelize.query(query, {
      type: Sequelize.QueryTypes.SELECT,
      include: [Bseller]
    });

    const ordersToUpdate = [];
    const ordersToCreate = [];
    const ordersToDelete = [];

    for (const order of getOrdersToCheckStatus) {
      const { status_anymarket, status_bseller, id_anymarket } = order;

      const validateStatusEquivalence = async (statusToCheckAnymarket, statusToCheckBseller) => {
        const validateReturn = await StatusEquivalence.CheckStatusEquivalence(statusToCheckAnymarket, statusToCheckBseller);
        if (validateReturn === true) {
          const checkAlreadyExist = await StatusValidation.findOne({
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
            status_bseller
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
      await StatusValidation.destroy({
        where: {
          id_anymarket: ordersToDelete
        }
      });
    }

    if (ordersToCreate.length > 0) {
      await StatusValidation.bulkCreate(ordersToCreate, {
        updateOnDuplicate: ['status_anymarket', 'status_bseller'],
        conflictAttributes: ['id_anymarket']
    });
    }

    if (ordersToUpdate.length > 0) {
      await Anymarket.update(
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
  OrdersStatusValidation
};