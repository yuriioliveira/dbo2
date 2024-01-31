// Verificar se os status finalizadores ( CONCLUDED e CANCELED) estão equivalentes e então incluir uma 
// flag para que não sejam consultados novamente. 
// rever a logica para otimizar e não chamar o destroy desnecessariamente. 

const Anymarket = require('../models/Anymarket');
const Bseller = require('../models/Bseller');
const StatusValidation = require('../models/StatusValidation');

const { Sequelize } = require('sequelize');
const StatusEquivalence = require('../utils/StatusEquivalence');

async function OrdersStatusValidation() {
  try {
    const query = `
      SELECT a.id_anymarket, a.status_anymarket, b.id_entrega, b.status_bseller
      FROM anymarkets a
      JOIN bsellers b ON a.id_anymarket = b.id_anymarket
      WHERE a.fulfillment = false
    `;
    const getOrdersToCheckStatus = await Anymarket.sequelize.query(query, {
      type: Sequelize.QueryTypes.SELECT,
      include: [Bseller]
    });

    let quantidadeStatusOk = 0;
    let quantidadeStatuserro = 0;
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
            await StatusValidation.destroy({
              where: {
                id_anymarket
              }
            });
            quantidadeStatusOk++;
          }
        } else {
          await StatusValidation.findOrCreate({
            where: { id_anymarket },
            defaults: {
              id_anymarket,
              status_anymarket,
              status_bseller
            }
          });
          quantidadeStatuserro++;
        }
      };

      await validateStatusEquivalence(status_anymarket, status_bseller);
    }

    return { quantidadeStatusOk, quantidadeStatuserro };
  } catch (error) {
    console.error('Erro em OrdersStatusValidation.js, Erro 01: ', error);
  }
}

module.exports = {
  OrdersStatusValidation
};