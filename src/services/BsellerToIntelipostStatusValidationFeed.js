// CRIAR CONTROLE NA TABELA INTELIPOST_ORDERS PARA NÃO MONITORAR STATUS DE PEDIDOS QUE JÁ FORAM ENTREGUES ou CANCELADOS

// pegar id_anymarket, id_entrega e status_intelipost da tabela intelipost_orders
// pegar status_bseller da tabela bseller_orders
// pegar status_anymarket da tabela anymarket_orders
// comparar status_intelipost com status_bseller

const BsellertointelipostStatusValidation = require('../models/BsellertointelipostStatusValidation');
const IntelipostOrder = require('../models/IntelipostOrder');
const { Sequelize } = require('sequelize');
const BsellerToIntelipostStatusEquivalenceUtils = require('../utils/BsellerToIntelipostStatusEquivalenceUtils');

async function BsellerToIntelipostStatusValidationFeed() {
    let quantidadeStatusOk = 0;
    let quantidadeStatuserro = 0;

    try {
        const query = `
        SELECT 
            a.id_anymarket, 
            a.id_entrega, 
            a.status_intelipost,
            b.status_bseller,
            c.status_anymarket
        FROM 
            intelipost_orders a
        JOIN 
            bseller_orders b ON a.id_anymarket = b.id_anymarket
        JOIN 
            anymarket_orders c ON a.id_anymarket = c.id_anymarket
        WHERE
            b.origem_pedido <> 'Troca' AND a.monitorar_status = true
      `;

        const getOrdersToCheckStatus = await IntelipostOrder.sequelize.query(query, {
            type: Sequelize.QueryTypes.SELECT

        });

        const ordersToUpdate = [];
        const ordersToCreate = [];
        const ordersToDelete = [];

        for (const order of getOrdersToCheckStatus) {
            const { id_anymarket, id_entrega, status_intelipost, status_bseller, status_anymarket } = order;
            const validateStatusEquivalence = async (statusToCheckIntelipost, statusToCheckBseller) => {
                const validateReturn = await BsellerToIntelipostStatusEquivalenceUtils.BsellerToIntelipostCheckStatusEquivalence(statusToCheckIntelipost, statusToCheckBseller);
                if (validateReturn === true) {
                    const checkAlreadyExist = await BsellertointelipostStatusValidation.findOne({
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
                        id_entrega,
                        status_intelipost,
                        status_bseller,
                        status_anymarket
                    });
                    quantidadeStatuserro++;
                }

                if (statusToCheckIntelipost === 'DELIVERED' && statusToCheckBseller === 'ENT') {
                    ordersToUpdate.push(id_anymarket);
                } else if (statusToCheckIntelipost === 'DELIVERY_FAILED' && statusToCheckBseller === 'CAN') {
                    ordersToUpdate.push(id_anymarket);
                }
            };

            await validateStatusEquivalence(status_intelipost, status_bseller);
        }
        if (ordersToDelete.length > 0) {
            await BsellertointelipostStatusValidation.destroy({
                where: {
                    id_anymarket: ordersToDelete
                }
            });
        }

        if (ordersToCreate.length > 0) {
            await BsellertointelipostStatusValidation.bulkCreate(ordersToCreate, {
                updateOnDuplicate: ['status_bseller', 'status_intelipost', 'status_anymarket'],
                conflictAttributes: ['id_anymarket']
            });
        }

        if (ordersToUpdate.length > 0) {
            await IntelipostOrder.update(
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
        console.log('Erro em BsellerToIntelipostStatusValidationFeed.js, Erro 01: ', error)
    }
}

module.exports = {
    BsellerToIntelipostStatusValidationFeed
};