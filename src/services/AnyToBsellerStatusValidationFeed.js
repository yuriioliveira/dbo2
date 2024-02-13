const AnymarketOrder = require('../models/AnymarketOrder');
const BsellerOrder = require('../models/BsellerOrder');
const AnyToBsellerStatusValidation = require('../models/AnytobsellerStatusValidation');
const { Sequelize } = require('sequelize');
const AnyToBsellerStatusEquivalenceUtils = require('../utils/AnyToBsellerStatusEquivalenceUtils');

async function AnyToBsellerStatusValidationFeed() {
  let quantidadeStatusOk = 0;
  let quantidadeStatuserro = 0;

  // colocar na tabela os dados de NF da Anymarket
  //id_anymarket	id_entrega	status_anymarket	status_bseller	observacoes	chave_nf	numero_nf	serie_nf

  
  // SELECT a.id_anymarket, c.id_entrega, a.status_anymarket, a.status_bseller, a.observacoes, b.chave_nf, b.numero_nf, b.serie_nf
  // FROM anytobseller_status_validations a
  // JOIN bseller_orders c ON a.id_anymarket = c.id_anymarket
  // JOIN anymarket_orders b ON a.id_anymarket = b.id_anymarket


  try {
    const query = `
      SELECT a.id_anymarket, a.status_anymarket, b.id_entrega, b.status_bseller, a.chave_nf, a.numero_nf, a.serie_nf
      FROM anymarket_orders a
      JOIN bseller_orders b ON a.id_anymarket = b.id_anymarket
      WHERE a.fulfillment = false AND a.monitorar_status = true AND b.origem_pedido = 'Site'
    `;
    const getOrdersToCheckStatus = await AnymarketOrder.sequelize.query(query, {
      type: Sequelize.QueryTypes.SELECT,
      include: [BsellerOrder],
    });

    const ordersToUpdate = [];
    const ordersToCreate = [];
    const ordersToDelete = [];

    for (const order of getOrdersToCheckStatus) {
      const { id_anymarket, id_entrega, status_anymarket, status_bseller, chave_nf, numero_nf, serie_nf } = order;

      const validateStatusEquivalence = async (
        statusToCheckAnymarket,
        statusToCheckBseller
      ) => {
        const validateReturn =
          await AnyToBsellerStatusEquivalenceUtils.CheckStatusEquivalence(
            statusToCheckAnymarket,
            statusToCheckBseller
          );
        if (validateReturn === true) {
          const checkAlreadyExist = await AnyToBsellerStatusValidation.findOne({
            where: {
              id_anymarket,
            },
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
            id_entrega,
            status_anymarket,
            status_bseller,
            chave_nf,
            numero_nf,
            serie_nf
          });
          quantidadeStatuserro++;
        }

        if (
          statusToCheckAnymarket === 'CONCLUDED' &&
          statusToCheckBseller === 'ENT'
        ) {
          ordersToUpdate.push(id_anymarket);
        } else if (
          statusToCheckAnymarket === 'CANCELED' &&
          statusToCheckBseller === 'CAN'
        ) {
          ordersToUpdate.push(id_anymarket);
        }
      };

      await validateStatusEquivalence(status_anymarket, status_bseller);
    }

    if (ordersToDelete.length > 0) {
      await AnyToBsellerStatusValidation.destroy({
        where: {
          id_anymarket: ordersToDelete,
        },
      });
    }

    if (ordersToCreate.length > 0) {
      await AnyToBsellerStatusValidation.bulkCreate(ordersToCreate, {
        updateOnDuplicate: ['status_anymarket', 'status_bseller'],
        conflictAttributes: ['id_anymarket'],
      });
    }

    if (ordersToUpdate.length > 0) {
      await AnymarketOrder.update(
        { monitorar_status: false },
        {
          where: {
            id_anymarket: ordersToUpdate,
          },
        }
      );
    }

    return { quantidadeStatusOk, quantidadeStatuserro };
  } catch (error) {
    console.error('Erro em OrdersStatusValidation.js, Erro 01: ', error);
  }
}

module.exports = {
  AnyToBsellerStatusValidationFeed,
};
