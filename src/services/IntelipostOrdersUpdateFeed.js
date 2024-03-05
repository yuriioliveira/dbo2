const IntelipostOrder = require('../models/IntelipostOrder');
const IntelipostErrors = require('../models/IntelipostErrors');
const IntelipostUtils = require('../utils/IntelipostUtils');
const { Sequelize } = require('sequelize');

// TRATAR ERRO 400 NA INTELIPOST PELO PEDIDO NAO EXISTIR
// nao atualizar pedidos com status após ETR e antes de NFS.  
async function IntelipostOrdersUpdateFeed() {

    let registroAtualizados = 0;
    let errosIntelipost = 0;
    try {
        const query = `SELECT * FROM intelipost_orders WHERE status_intelipost IS NULL OR status_intelipost <> 'DELIVERED';`;
        // const query = `SELECT * FROM intelipost_orders WHERE id_entrega = '91007917';`;

        const ordersToIntelipost = await IntelipostOrder.sequelize.query(query, {
            type: Sequelize.QueryTypes.SELECT,
        });

        for (const order of ordersToIntelipost) {
            let idEntrega = order.id_entrega;
            let id_entrega = idEntrega
            const intelipostOrdersData = await IntelipostUtils.intelipostGetOrdersData(idEntrega);

            if (intelipostOrdersData.pedido === 'não encontrado') {

                const checkAlreadyExist = await IntelipostErrors.findOne({
                    where: { id_entrega },
                });

                if (checkAlreadyExist === null) {
                    await IntelipostErrors.create({
                        id_entrega: idEntrega,
                        id_anymarket: order.id_anymarket,
                    })
                    errosIntelipost++;
                } else {
                    continue;
                }
            } else {
                let idAnymarketUpdate = order.id_anymarket
                let = intelipostInfoUpdate = {
                    status_intelipost: intelipostOrdersData.content.shipment_order_volume_array[0].shipment_order_volume_state,
                    chave_nf: intelipostOrdersData.content.shipment_order_volume_array[0].shipment_order_volume_invoice.invoice_key,
                    numero_nf: intelipostOrdersData.content.shipment_order_volume_array[0].shipment_order_volume_invoice.invoice_number,
                    serie_nf: intelipostOrdersData.content.shipment_order_volume_array[0].shipment_order_volume_invoice.invoice_series,
                    data_nf: intelipostOrdersData.content.shipment_order_volume_array[0].shipment_order_volume_invoice.invoice_date_iso_iso
                };
                await IntelipostUtils.intelipostUpdate(idAnymarketUpdate, intelipostInfoUpdate)
                registroAtualizados++;
            }
        }

    } catch (error) {
        console.error('Erro em updateFeedIntelipost.js, Erro 01: ', error);

    }
    return {
        registroAtualizados,
        errosIntelipost
    };
}

module.exports = {
    IntelipostOrdersUpdateFeed
};
