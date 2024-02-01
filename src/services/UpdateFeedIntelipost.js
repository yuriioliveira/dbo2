const Intelipost = require('../models/Intelipost');
const IntelipostUtils = require('../utils/IntelipostUtils');
const { Sequelize } = require('sequelize');


async function updateFeedIntelipost() {

    let registroAtualizados = 0;
    try {
        const query = `SELECT * FROM Inteliposts WHERE status_intelipost IS NULL OR status_intelipost <> 'DELIVERED';`;
        
        const ordersToIntelipost = await Intelipost.sequelize.query(query, {
            type: Sequelize.QueryTypes.SELECT,
        });
        
        for (const order of ordersToIntelipost ) {
            let idEntrega = order.id_entrega;
            console.log("#### CHEGOU AQUI ####");
            console.log(idEntrega)
            console.log("#### Fim ####")

            const intelipostOrdersData = await IntelipostUtils.intelipostGetOrdersData(idEntrega);

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

        console.log(ordersToIntelipost)
    } catch (error) {
        console.error('Erro em updateFeedIntelipost.js, Erro 01: ', error);
        
    }
    return {
        registroAtualizados
      };
}

module.exports = {
    updateFeedIntelipost
  };
